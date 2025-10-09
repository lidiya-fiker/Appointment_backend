import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInOut } from './checkinout.entity';
import { CheckInOutController } from './checkinout.controller';
import { CheckInOutService } from './checkinout.service';
import { Request } from 'src/requests/request.entity';
import { Customer } from 'src/customers/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInOut, Request, Customer])],
  controllers: [CheckInOutController],
  providers: [CheckInOutService],
  exports: [TypeOrmModule],
})
export class CheckInOutModule {}
