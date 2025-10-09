import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CheckInDto {
  @ApiProperty() @IsUUID() requestId: string; // or customerId
}
