import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateIntegritySettingDto } from './dto/create-integrity-setting.dto';
import { UpdateIntegritySettingDto } from './dto/update-integrity-setting.dto';
import { IntegritySetting } from './integriry.entity';

@Injectable()
export class IntegritySettingService {
  constructor(
    @InjectRepository(IntegritySetting)
    private readonly integrityRepo: Repository<IntegritySetting>,
  ) {}

  async create(dto: CreateIntegritySettingDto): Promise<IntegritySetting> {
    const setting = this.integrityRepo.create(dto);
    return this.integrityRepo.save(setting);
  }

  async findAll(): Promise<IntegritySetting[]> {
    return this.integrityRepo.find();
  }

  async findOne(id: string): Promise<IntegritySetting> {
    const setting = await this.integrityRepo.findOne({ where: { id } });
    if (!setting) throw new NotFoundException('Integrity Setting not found');
    return setting;
  }

  async update(
    id: string,
    dto: UpdateIntegritySettingDto,
  ): Promise<IntegritySetting> {
    const setting = await this.findOne(id);
    Object.assign(setting, dto);
    return this.integrityRepo.save(setting);
  }

  async remove(id: string): Promise<void> {
    const setting = await this.findOne(id);
    await this.integrityRepo.remove(setting);
  }
}
