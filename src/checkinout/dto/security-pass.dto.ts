import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SecurityPassDto {
  @ApiProperty({ description: 'Security check passed', example: true })
  @IsBoolean()
  securityPassed: boolean;
}
