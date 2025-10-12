import { Controller, Body, UseGuards, Req, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private svc: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  list() {
    return this.svc.listAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile')
  updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
    return this.svc.updateProfile(req.user.id, body);
  }
}
