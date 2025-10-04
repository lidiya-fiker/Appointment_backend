import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInOut } from './checkinout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInOut])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class CheckInOutModule {}
