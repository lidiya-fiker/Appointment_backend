import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, IntegrityTier } from './customer.entity';
import { Request, RequestStatus } from 'src/requests/request.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepo.find({ relations: ['requests'] });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['requests'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    if (
      data.integrityTier &&
      !Object.values(IntegrityTier).includes(data.integrityTier)
    ) {
      throw new Error('Invalid IntegrityTier value');
    }
    const customer = this.customerRepo.create(data);
    return this.customerRepo.save(customer);
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, data);
    return this.customerRepo.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepo.remove(customer);
  }

  async completeRequest(requestId: string): Promise<Request> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['customer'],
    });
    if (!request) throw new NotFoundException('Request not found');

    request.status = RequestStatus.COMPLETED;
    await this.requestRepo.save(request);

    // Recalculate integrityTier example logic
    const customer = request.customer;
    const completedRequests = customer.requests?.filter(
      (r) => r.status === RequestStatus.COMPLETED,
    ).length;

    if (completedRequests >= 5) {
      customer.integrityTier = IntegrityTier.GOLD;
    } else if (completedRequests >= 3) {
      customer.integrityTier = IntegrityTier.SILVER;
    } else {
      customer.integrityTier = IntegrityTier.PLATINUM;
    }

    await this.customerRepo.save(customer);
    return request;
  }
}
