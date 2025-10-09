import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsString() message: string;
  @ApiProperty({ required: false }) @IsOptional() toUserId?: string;
  @ApiProperty({ required: false }) @IsOptional() requestId?: string;
}
