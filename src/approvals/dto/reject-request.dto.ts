import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectRequestDto {
  @ApiProperty({ example: 'customer not eligible for visit today' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
