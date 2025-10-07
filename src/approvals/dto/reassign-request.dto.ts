import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class ReassignRequestDto {
  @ApiProperty({ example: '2025-10-10' })
  @IsString()
  @IsNotEmpty()
  reassignedDate: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  reassignedTimeFrom: string;

  @ApiProperty({ example: '15:00' })
  @IsString()
  @IsNotEmpty()
  reassignedTimeTo: string;

  @ApiPropertyOptional({ example: ['Laptop'] })
  @IsOptional()
  @IsArray()
  allowedMaterials?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  inspectionRequired?: boolean;
}
