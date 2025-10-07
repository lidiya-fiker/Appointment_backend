import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { RequestStatus } from '../request.entity';

export class FilterRequestDto {
  @ApiProperty({ required: false, enum: RequestStatus })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
