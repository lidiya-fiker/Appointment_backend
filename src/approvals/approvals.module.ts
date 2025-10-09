import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Approval } from './approvals.entity';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { Request } from 'src/requests/request.entity';
import { Customer } from 'src/customers/customer.entity';
import { NotificationModule } from 'src/notifications/notification.module';
import { Notification } from 'src/notifications/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Approval, Request, Customer, Notification]),
    NotificationModule,
  ],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [TypeOrmModule],
})
export class ApprovalModule {}
