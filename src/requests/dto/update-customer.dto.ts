// src/customers/dto/update-customer.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  organization?: string;

  @ApiPropertyOptional()
  occupation?: string;
}
