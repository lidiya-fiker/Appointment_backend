import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsOptional, IsArray } from 'class-validator';

export class ReassignRequestDto {
  @ApiProperty() @IsDateString() reassignedDate: string;
  @ApiProperty() @IsString() reassignedTimeFrom: string;
  @ApiProperty() @IsString() reassignedTimeTo: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  allowedMaterials?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  inspectionRequired?: boolean;
}
