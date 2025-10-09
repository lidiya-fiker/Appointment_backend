import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsArray } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  allowedMaterials?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  inspectionRequired?: boolean;
}
