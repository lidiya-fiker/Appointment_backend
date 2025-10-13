import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { Customer } from 'src/customers/customer.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from 'src/user/user.entity';
import { UpdateRequestDto } from './dto/update-request.dto';

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

  async findCompleted() {
    return this.requestRepo.find({
      where: { status: RequestStatus.COMPLETED },
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findRejected() {
    return this.requestRepo.find({
      where: { status: RequestStatus.REJECTED },
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });
  }

  //approved requests
  async findApproved() {
    return this.requestRepo.find({
      where: { status: RequestStatus.APPROVED },
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findReassigned() {
    return this.requestRepo.find({
      where: { status: RequestStatus.REASSIGNED },
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async getDashboardCounts() {
    const [approved, rejected, completed, pending] = await Promise.all([
      this.requestRepo.count({ where: { status: RequestStatus.APPROVED } }),
      this.requestRepo.count({ where: { status: RequestStatus.REJECTED } }),
      this.requestRepo.count({ where: { status: RequestStatus.COMPLETED } }),
      this.requestRepo.count({ where: { status: RequestStatus.PENDING } }),
    ]);

    return { approved, rejected, completed, pending };
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

  async update(id: string, dto: UpdateRequestDto) {
    // 1️⃣ Fetch the request with its customer
    const req = await this.requestRepo.findOne({
      where: { id },
      relations: [
        'customer',
        'createdBy',
        'createdBy.role',
        'createdBy.role.permissions',
      ],
    });

    if (!req) throw new NotFoundException('Request not found');

    // 2️⃣ Update customer safely
    if (dto.customer) {
      const customer = await this.customerRepo.findOne({
        where: { id: req.customer.id },
      });
      if (!customer) throw new NotFoundException('Customer not found');

      // Check for email uniqueness
      if (dto.customer.email && dto.customer.email !== customer.email) {
        const existingEmail = await this.customerRepo.findOne({
          where: { email: dto.customer.email },
        });
        if (existingEmail && existingEmail.id !== customer.id) {
          throw new Error('Email already in use by another customer');
        }
      }

      // Update allowed fields
      Object.assign(customer, dto.customer);
      await this.customerRepo.save(customer); // safe UPDATE

      // Assign managed entity back to request to prevent TypeORM trying to insert
      req.customer = customer;
    }

    // 3️⃣ Update request fields (excluding nested customer)
    const { customer, ...requestFields } = dto; // remove nested customer from dto
    Object.assign(req, requestFields);

    try {
      await this.requestRepo.save(req); // safe UPDATE
    } catch (error) {
      throw new Error('Failed to update request: ' + error.message);
    }

    // 4️⃣ Return the updated request with relations
    return this.requestRepo.findOne({
      where: { id },
      relations: [
        'customer',
        'createdBy',
        'createdBy.role',
        'createdBy.role.permissions',
      ],
    });
  }

  async remove(id: string) {
    const req = await this.requestRepo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');
    await this.requestRepo.remove(req);
    return { message: 'deleted' };
  }
}
