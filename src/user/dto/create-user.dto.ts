import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsNotEmpty() lastName: string;
  @ApiProperty() @IsNotEmpty() middleName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @MinLength(6) password: string;
  @ApiProperty({ required: true }) @IsNotEmpty() roleName: string; // role name string (dynamic)
}
