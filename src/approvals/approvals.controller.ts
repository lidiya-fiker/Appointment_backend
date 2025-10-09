import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { ReassignRequestDto } from './dto/reassign-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permission } from 'src/common/decorators/permissions.decorator';

@ApiTags('Approvals')
@Controller('approvals')
export class ApprovalsController {
  constructor(private svc: ApprovalsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('approve_request')
  @ApiBearerAuth()
  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() dto: ApproveRequestDto) {
    return this.svc.approve(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('approve_request')
  @ApiBearerAuth()
  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectRequestDto) {
    return this.svc.reject(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('approve_request')
  @ApiBearerAuth()
  @Post(':id/reassign')
  reassign(@Param('id') id: string, @Body() dto: ReassignRequestDto) {
    return this.svc.reassign(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.svc.cancel(id);
  }
}
