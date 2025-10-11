import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegritySetting } from './integriry.entity';
import { IntegritySettingService } from './integrity.service';
import { IntegritySettingController } from './integrity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IntegritySetting])],
  controllers: [IntegritySettingController],
  providers: [IntegritySettingService],
  exports: [TypeOrmModule],
})
export class IntegritySettingModule {}
