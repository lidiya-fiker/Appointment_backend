import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, RequestStatus } from 'src/requests/request.entity';
import { CheckInOut } from './checkinout.entity';
import { Customer } from 'src/customers/customer.entity';
import { SecurityPassDto } from './dto/security-pass.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CheckInOutService {
  constructor(
    @InjectRepository(CheckInOut) private checkRepo: Repository<CheckInOut>,
    @InjectRepository(Request) private requestRepo: Repository<Request>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  // Internal helper to get or create the CheckInOut record
  private async getOrCreateRecord(requestId: string): Promise<CheckInOut> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['customer'],
    });
    if (!request) throw new NotFoundException('Request not found');

    let record = await this.checkRepo.findOne({
      where: { request: { id: request.id } },
      relations: ['request', 'customer'],
    });

    if (!record) {
      record = this.checkRepo.create({
        request: request as any, // cast to DeepPartial<Request>
        customer: request.customer as any, // cast to DeepPartial<Customer>
      });
      await this.checkRepo.save(record);
    }

    return record;
  }

  async markSecurityPassed(requestId: string, dto: SecurityPassDto) {
    const record = await this.getOrCreateRecord(requestId);

    record.securityPassed = dto.securityPassed;
    return this.checkRepo.save(record);
  }

  // Toggle check-in
  async checkIn(requestId: string) {
    const record = await this.getOrCreateRecord(requestId);

    if (!record.securityPassed)
      throw new BadRequestException('Security must pass before check-in');

    record.checkedIn = !record.checkedIn;

    // If unchecked, also unmark completed
    if (!record.checkedIn) {
      record.completed = false;
      record.checkedOut = false;
      if (record.request.status === RequestStatus.COMPLETED)
        record.request.status = RequestStatus.APPROVED;
      await this.requestRepo.save(record.request as any);
    }

    return this.checkRepo.save(record);
  }

  // Toggle check-out
  async checkOut(requestId: string) {
    const record = await this.getOrCreateRecord(requestId);

    if (!record.checkedIn)
      throw new BadRequestException('Check-in must be done before check-out');

    record.checkedOut = !record.checkedOut;

    // Update completed status and request
    record.completed = record.checkedIn && record.checkedOut;
    record.request.status = record.completed
      ? RequestStatus.COMPLETED
      : RequestStatus.APPROVED;

    await this.requestRepo.save(record.request as any);
    return this.checkRepo.save(record);
  }

  async findByRequest(requestId: string) {
    return this.getOrCreateRecord(requestId);
  }
}
