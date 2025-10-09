import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'data-source';
import { UserModule } from './user/user.module';
import { RequestModule } from './requests/request.module';

import { CustomerModule } from './customers/customer.module';
import { IntegritySettingModule } from './integrity/integrity.module';
import { NotificationModule } from './notifications/notification.module';
import { CheckInOutModule } from './checkinout/checkinout.module';
import { AuthModule } from './auth/auth.module';
import { ApprovalModule } from './approvals/approvals.module';
import { RoleModule } from './roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: () => dataSourceOptions,
    }),
    AuthModule,
    UserModule,
    RequestModule,
    ApprovalModule,
    CustomerModule,
    IntegritySettingModule,
    NotificationModule,
    CheckInOutModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
