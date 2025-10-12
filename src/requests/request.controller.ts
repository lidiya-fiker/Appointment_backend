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
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { FilterRequestDto } from './dto/filter-request.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly svc: RequestsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('create_appointment')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('front_desk', 'ceo')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('front_desk', 'ceo')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
