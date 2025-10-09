// src/auth/dto/update-role-permissions.dto.ts
import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    example: ['create_appointment', 'check_in'],
    description: 'List of permission keys to grant or revoke',
  })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}
