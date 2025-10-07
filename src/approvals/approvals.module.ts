import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Approval } from './approvals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Approval])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ApprovalModule {}
