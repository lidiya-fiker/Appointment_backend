import { PartialType } from '@nestjs/mapped-types';
import { CreateIntegritySettingDto } from './create-integrity-setting.dto';

export class UpdateIntegritySettingDto extends PartialType(
  CreateIntegritySettingDto,
) {}
