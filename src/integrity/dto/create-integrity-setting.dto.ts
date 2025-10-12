import { IsString, IsEnum, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Period } from '../integriry.entity';

export class CreateIntegritySettingDto {
  @ApiProperty({ example: 'Gold' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Period, example: Period.MONTH })
  @IsEnum(Period)
  period: Period;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(1)
  visits: number;
}
