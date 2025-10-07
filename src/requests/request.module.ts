import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { RequestsController } from './request.controller';
import { RequestsService } from './request.service';
import { Customer } from 'src/customers/customer.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Customer, User])],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [TypeOrmModule],
})
export class RequestModule {}
