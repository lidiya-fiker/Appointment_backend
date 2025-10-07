import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateRequestDto {
  // customer info (handled by front desk)
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  organization: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  occupation: string;

  // appointment info
  @ApiProperty()
  @IsDateString()
  appointmentDate: string;

  @ApiProperty()
  @IsString()
  timeFrom: string;

  @ApiProperty()
  @IsString()
  timeTo: string;

  @ApiProperty()
  @IsString()
  purpose: string;
}
