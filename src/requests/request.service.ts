import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { Customer } from 'src/customers/customer.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateRequestDto, createdBy: User) {
    // create or reuse customer by email
    let customer = await this.customerRepo.findOne({
      where: { email: dto.email },
    });
    if (!customer) {
      customer = this.customerRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        gender: dto.gender,
        country: dto.country,
        city: dto.city,
        organization: dto.organization,
        occupation: dto.occupation,
      });
      await this.customerRepo.save(customer);
    }

    const dbUser = await this.userRepo.findOne({ where: { id: createdBy.id } });
    if (!dbUser) throw new NotFoundException('Creator user not found');

    const request = this.requestRepo.create({
      customer,
      createdBy: dbUser,
      appointmentDate: dto.appointmentDate,
      timeFrom: dto.timeFrom,
      timeTo: dto.timeTo,
      purpose: dto.purpose,
      status: RequestStatus.PENDING,
    });

    return await this.requestRepo.save(request);
  }

  async findAll() {
    return this.requestRepo.find({
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findPending() {
    return this.requestRepo.find({
      where: { status: RequestStatus.PENDING },
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async filter(status?: RequestStatus, from?: string, to?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (from && to) where.appointmentDate = Between(from, to);
    return this.requestRepo.find({
      where,
      relations: ['customer', 'approval'],
    });
  }

  async update(id: string, update: Partial<Request>) {
    const req = await this.requestRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!req) throw new NotFoundException('Request not found');

    Object.assign(req, update);
    // if nested customer updated (sent as object on update.customer), save it separately:
    if ((update as any).customer) {
      Object.assign(req.customer, (update as any).customer);
      await this.customerRepo.save(req.customer);
    }
    return this.requestRepo.save(req);
  }

  async remove(id: string) {
    const req = await this.requestRepo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');
    await this.requestRepo.remove(req);
    return { message: 'deleted' };
  }
}
