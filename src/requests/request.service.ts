// In your RequestsService
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { Customer } from 'src/customers/customer.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { FilterRequestDto } from './dto/filter-request.dto';
import { User } from 'src/user/user.entity';
import { instanceToPlain } from 'class-transformer';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Create a new request
  async create(createDto: CreateRequestDto, createdBy: User) {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      country,
      city,
      organization,
      occupation,
      appointmentDate,
      timeFrom,
      timeTo,
      purpose,
    } = createDto;

    let customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      customer = this.customerRepo.create({
        firstName,
        lastName,
        email,
        phone,
        gender,
        country,
        city,
        organization,
        occupation,
      });
      await this.customerRepo.save(customer);
    }

    const dbUser = await this.userRepo.findOne({ where: { id: createdBy.id } });
    if (!dbUser) throw new NotFoundException('Invalid user creating request');

    const request = this.requestRepo.create({
      customer,
      createdBy: dbUser,
      appointmentDate,
      timeFrom,
      timeTo,
      purpose,
      status: RequestStatus.PENDING,
    });

    const savedRequest = await this.requestRepo.save(request);
    const plain = instanceToPlain(savedRequest) as any;

    // Remove createdBy completely
    delete plain.createdBy;

    return plain;
  }

  async filter(filter: FilterRequestDto) {
    const where: any = {};
    if (filter.status) where.status = filter.status;
    if (filter.fromDate && filter.toDate) {
      where.appointmentDate = Between(
        new Date(filter.fromDate),
        new Date(filter.toDate),
      );
    }

    const requests = await this.requestRepo.find({
      where,
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });

    const plain = instanceToPlain(requests) as any[];
    // Remove createdBy from each request
    plain.forEach((r) => delete r.createdBy);

    return plain;
  }

  // Update a request
  // ✅ Update request (including nested customer)
  async update(id: string, updateDto: UpdateRequestDto) {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!request) throw new NotFoundException('Request not found');

    const { customer: customerDto, ...requestFields } = updateDto;

    // ✅ Update request fields
    Object.entries(requestFields).forEach(([key, value]) => {
      if (value !== undefined) (request as any)[key] = value;
    });

    // ✅ Update nested customer (force update)
    if (customerDto && request.customer) {
      await this.customerRepo
        .createQueryBuilder()
        .update(Customer)
        .set(customerDto)
        .where('id = :id', { id: request.customer.id })
        .execute();
    }

    // ✅ Save request (after customer is updated)
    const updated = await this.requestRepo.save(request);

    // ✅ Reload customer to return updated data
    const refreshed = await this.requestRepo.findOne({
      where: { id: updated.id },
      relations: ['customer'],
    });

    const plain = instanceToPlain(refreshed) as any;
    delete plain.createdBy;

    return plain;
  }

  // Delete a request
  async remove(id: string) {
    const request = await this.requestRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');

    await this.requestRepo.remove(request);
    return { message: 'Request deleted successfully' };
  }

  async findAll(): Promise<any> {
    const requests = await this.requestRepo.find({
      relations: ['customer', 'approval'],
      order: { appointmentDate: 'ASC' },
    });

    const plain = instanceToPlain(requests) as any[];
    plain.forEach((r) => delete r.createdBy);

    return plain;
  }
}
