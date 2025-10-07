import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateApprovalDto {
  @IsUUID()
  requestId: string;

  @IsOptional()
  @IsBoolean()
  inspectionRequired?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedMaterials?: string[];

  @IsOptional()
  @IsString()
  reason?: string;
}
