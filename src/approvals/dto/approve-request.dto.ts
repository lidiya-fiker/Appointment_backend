import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty({ example: ['Laptop', 'phone'] })
  @IsArray()
  @IsNotEmpty()
  allowedMaterials: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  inspectionRequired: boolean;
}
