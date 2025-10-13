import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestsService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { FilterRequestDto } from './dto/filter-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly svc: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateRequestDto, @Req() req) {
    const user: User = req.user;
    return this.svc.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterRequestDto) {
    const { status, fromDate, toDate } = query;
    return this.svc.filter(status, fromDate, toDate);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  findAllRaw() {
    return this.svc.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('pending')
  async findPending() {
    return this.svc.findPending();
  }
  //approved requests
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('approved')
  async findApproved() {
    return this.svc.findApproved();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('reassigned')
  async findReassigned() {
    return this.svc.findReassigned();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('completed')
  async findCompleted() {
    return this.svc.findCompleted();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('rejected')
  async findRejected() {
    return this.svc.findRejected();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('dashboard')
  async getDashboard() {
    return this.svc.getDashboardCounts();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiBody({ type: UpdateRequestDto })
  async update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
