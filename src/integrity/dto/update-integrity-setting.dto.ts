import { PartialType } from '@nestjs/mapped-types';
import { CreateIntegritySettingDto } from './create-integrity-setting.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIntegritySettingDto extends PartialType(
  CreateIntegritySettingDto,
) {
  @ApiPropertyOptional()
  tiers?: any[];
}
