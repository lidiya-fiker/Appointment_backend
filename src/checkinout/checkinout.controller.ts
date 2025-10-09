// src/checkinout/checkinout.controller.ts
import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { CheckInOutService } from './checkinout.service';
import { SecurityPassDto } from './dto/security-pass.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CheckInOut } from './checkinout.entity';

@ApiTags('CheckInOut')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checkinout')
export class CheckInOutController {
  constructor(private readonly checkService: CheckInOutService) {}

  @ApiOperation({ summary: 'Mark security passed for a request' })
  @ApiResponse({
    status: 200,
    description: 'Security updated',
    type: CheckInOut,
  })
  @Post(':requestId/security-pass')
  async markSecurity(
    @Param('requestId') requestId: string,
    @Body() dto: SecurityPassDto,
  ) {
    return this.checkService.markSecurityPassed(requestId, dto);
  }

  @ApiOperation({ summary: 'Toggle check-in for a request' })
  @ApiResponse({
    status: 200,
    description: 'Check-in toggled',
    type: CheckInOut,
  })
  @Post(':requestId/checkin')
  async checkIn(@Param('requestId') requestId: string) {
    return this.checkService.checkIn(requestId);
  }

  @ApiOperation({ summary: 'Toggle check-out for a request' })
  @ApiResponse({
    status: 200,
    description: 'Check-out toggled',
    type: CheckInOut,
  })
  @Post(':requestId/checkout')
  async checkOut(@Param('requestId') requestId: string) {
    return this.checkService.checkOut(requestId);
  }

  @ApiOperation({ summary: 'Get check-in/out record by request' })
  @ApiResponse({
    status: 200,
    description: 'CheckInOut record',
    type: CheckInOut,
  })
  @Get(':requestId')
  async getRecord(@Param('requestId') requestId: string) {
    return this.checkService.findByRequest(requestId);
  }
}
