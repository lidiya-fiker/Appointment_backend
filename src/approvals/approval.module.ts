import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Approval } from './approval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Approval])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ApprovalModule {}
