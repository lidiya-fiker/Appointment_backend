import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { ReassignRequestDto } from './dto/reassign-request.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Approvals')
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @ApiOperation({ summary: 'Approve a pending request' })
  @Post(':id/approve')
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveRequestDto,
  ) {
    return this.approvalsService.approve(id, dto);
  }

  @ApiOperation({ summary: 'Reject a pending request' })
  @Post(':id/reject')
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectRequestDto,
  ) {
    return this.approvalsService.reject(id, dto);
  }

  @ApiOperation({ summary: 'Reassign appointment date and time' })
  @Patch(':id/reassign')
  async reassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReassignRequestDto,
  ) {
    return this.approvalsService.reassign(id, dto);
  }

  @ApiOperation({ summary: 'Get all approvals' })
  @Get()
  async findAll() {
    return this.approvalsService.findAll();
  }
}
