// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRolePermissionsDto } from 'src/roles/dto/update-role-permissions.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 CEO creates a user
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  @ApiBearerAuth()
  async signup(@Body() dto: SignupDto, @Request() req) {
    return this.authService.signup(dto, req.user);
  }

  // 🔹 Login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // 🔹 Grant permission to role
  @UseGuards(JwtAuthGuard)
  @Post('roles/grant-multiple/:roleName')
  @ApiBearerAuth()
  async grantMultiple(
    @Param('roleName') roleName: string,
    @Body() dto: UpdateRolePermissionsDto,
    @Req() req,
  ) {
    return this.authService.grantPermissionsToRole(
      roleName,
      dto.permissionKeys,
      req.user,
    );
  }

  // 🔹 Revoke permission from role
  @UseGuards(JwtAuthGuard)
  @Post('roles/revoke-multiple/:roleName')
  @ApiBearerAuth()
  async revokeMultiple(
    @Param('roleName') roleName: string,
    @Body() dto: UpdateRolePermissionsDto,
    @Req() req,
  ) {
    return this.authService.revokePermissionsFromRole(
      roleName,
      dto.permissionKeys,
      req.user,
    );
  }
}
