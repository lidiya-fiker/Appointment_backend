import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegritySetting } from './integriry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IntegritySetting])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class IntegritySettingModule {}
