// src/requests/dto/update-request.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '../request.entity';
import { UpdateCustomerDto } from './update-customer.dto';

export class UpdateRequestDto {
  @ApiPropertyOptional()
  appointmentDate?: string;

  @ApiPropertyOptional()
  timeFrom?: string;

  @ApiPropertyOptional()
  timeTo?: string;

  @ApiPropertyOptional()
  purpose?: string;

  @ApiPropertyOptional({ enum: RequestStatus })
  status?: RequestStatus;

  @ApiPropertyOptional({ type: UpdateCustomerDto })
  customer?: UpdateCustomerDto;
}
