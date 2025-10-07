import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  UseGuards,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';

import { CreateRequestDto } from './dto/create-request.dto';
import { FilterRequestDto } from './dto/filter-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestsService } from './request.service';
import { UserRole } from 'src/user/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateRequestDto } from './dto/update-request.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // front desk creates customer + request
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.CEO, UserRole.FRONT_DESK)
  @Post()
  async create(@Body() dto: CreateRequestDto, @Req() req) {
    const user = req.user; // front desk
    return await this.requestsService.create(dto, user);
  }

  // filter by status or date range
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async filter(@Query() filter: FilterRequestDto) {
    return await this.requestsService.filter(filter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  async findAll() {
    return this.requestsService.findAll();
  }

  // Update a request
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.CEO, UserRole.FRONT_DESK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateRequestDto) {
    return await this.requestsService.update(id, updateDto);
  }

  // Delete a request
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.CEO, UserRole.FRONT_DESK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.requestsService.remove(id);
  }
}
