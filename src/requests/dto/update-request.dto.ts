import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCustomerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  middleName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() gender?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() plateNum?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() country?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  organization?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  occupation?: string;
}

export class UpdateRequestDto {
  @ApiProperty({ type: UpdateCustomerDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCustomerDto)
  customer?: UpdateCustomerDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() timeFrom?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() timeTo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() purpose?: string;
}
