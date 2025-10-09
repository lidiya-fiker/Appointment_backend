import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateRequestDto {
  @ApiProperty() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsNotEmpty() lastName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() phone: string;
  @ApiProperty({ required: false }) @IsOptional() gender?: string;
  @ApiProperty({ required: false }) @IsOptional() country?: string;
  @ApiProperty({ required: false }) @IsOptional() city?: string;
  @ApiProperty({ required: false }) @IsOptional() organization?: string;
  @ApiProperty({ required: false }) @IsOptional() occupation?: string;

  @ApiProperty() @IsDateString() appointmentDate: string;
  @ApiProperty() @IsString() timeFrom: string;
  @ApiProperty() @IsString() timeTo: string;
  @ApiProperty() @IsString() purpose: string;
}
