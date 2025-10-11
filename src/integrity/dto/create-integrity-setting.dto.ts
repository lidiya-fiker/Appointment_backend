import {
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Period } from '../integriry.entity';
import { ApiProperty } from '@nestjs/swagger';

class TierDto {
  @ApiProperty({ example: 'gold' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(1)
  visits: number;

  @ApiProperty({ enum: Period, example: Period.MONTH })
  @IsEnum(Period)
  period: Period;
}

export class CreateIntegritySettingDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TierDto)
  tiers: TierDto[];
}
