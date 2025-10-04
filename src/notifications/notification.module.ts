import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Request } from 'src/requests/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Request])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class NotificationModule {}
