import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RejectRequestDto {
  @ApiProperty() @IsNotEmpty() reason: string;
}
