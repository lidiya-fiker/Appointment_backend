import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Request } from 'src/requests/request.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Request])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
