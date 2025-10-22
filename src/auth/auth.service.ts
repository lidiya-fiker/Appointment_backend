// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { Role } from 'src/roles/role.entity';
import { Permission } from 'src/roles/permission.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ROLES } from 'src/roles/roles.constants';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 SIGNUP (Only CEO can create users)
  async signup(dto: SignupDto, creator: User): Promise<User> {
    if (!creator.role || creator.role.name !== 'CEO') {
      throw new ForbiddenException('Only CEO can create users');
    }

    const { email, password, firstName, lastName, middleName, role } = dto;

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);

    let assignedRole: Role;
    if (role) {
      assignedRole = await this.roleRepo.findOne({
        where: { name: role },
        relations: ['permissions'],
      });
      if (!assignedRole) throw new BadRequestException('Role not found');
    } else {
      // Default role if CEO doesn't pass one
      assignedRole = await this.roleRepo.findOne({
        where: { name: 'FRONT_DESK' },
        relations: ['permissions'],
      });
    }

    // 🔹 Ensure role has default permissions
    const defaultPermKeys = ROLES[assignedRole.name] || [];
    assignedRole.permissions = await this.permissionRepo.find({
      where: defaultPermKeys.map((key) => ({ key })),
    });

    const user = this.userRepo.create({
      firstName,
      lastName,
      middleName,
      email,
      password: hashed,
      role: assignedRole,
    });

    return await this.userRepo.save(user);
  }

  // 🔹 LOGIN
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ['role', 'role.permissions'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      role: {
        name: user.role.name,
        permissions: user.role.permissions.map((p) => p.key),
      },
    };

    const token = this.jwtService.sign(payload);

    const { password: _, ...result } = user;
    return { access_token: token, user: result };
  }

  // 🔹 VALIDATE USER (JWT Strategy)
  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: ['role', 'role.permissions'],
    });
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  // 🔹 GRANT MULTIPLE PERMISSIONS TO ROLE
  async grantPermissionsToRole(
    roleName: string,
    permissionKeys: string[],
    creator: User,
  ) {
    if (!creator.role || creator.role.name !== 'CEO') {
      throw new ForbiddenException('Only CEO can grant permissions');
    }

    const role = await this.roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions'],
    });
    if (!role) throw new BadRequestException('Role not found');

    const permissions = await this.permissionRepo.findBy({
      key: In(permissionKeys),
    });

    if (permissions.length === 0)
      throw new BadRequestException('No valid permissions found');

    // Add any that aren't already included
    for (const permission of permissions) {
      if (!role.permissions.some((p) => p.key === permission.key)) {
        role.permissions.push(permission);
      }
    }

    await this.roleRepo.save(role);
    return role;
  }

  // 🔹 REVOKE MULTIPLE PERMISSIONS FROM ROLE
  async revokePermissionsFromRole(
    roleName: string,
    permissionKeys: string[],
    creator: User,
  ) {
    if (!creator.role || creator.role.name !== 'CEO') {
      throw new ForbiddenException('Only CEO can revoke permissions');
    }

    const role = await this.roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions'],
    });
    if (!role) throw new BadRequestException('Role not found');

    role.permissions = role.permissions.filter(
      (p: Permission) => !permissionKeys.includes(p.key),
    );

    await this.roleRepo.save(role);
    return role;
  }

  // 🔹 CEO SELF-REGISTRATION (only if no CEO exists yet)
  async registerCEO(dto: SignupDto): Promise<User> {
    const existingCEO = await this.userRepo.findOne({
      where: { role: { name: 'CEO' } },
      relations: ['role'],
    });
    if (existingCEO) {
      throw new BadRequestException('A CEO account already exists');
    }

    const { email, password, firstName, lastName, middleName } = dto;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new BadRequestException('Email already registered');

    const ceoRole = await this.roleRepo.findOne({
      where: { name: 'CEO' },
      relations: ['permissions'],
    });
    if (!ceoRole) throw new BadRequestException('CEO role not found');

    const hashedPassword = await bcrypt.hash(password, 10);
    const ceo = this.userRepo.create({
      firstName,
      lastName,
      middleName,
      email,
      password: hashedPassword,
      role: ceoRole,
    });

    return await this.userRepo.save(ceo);
  }
  async ceoExists(): Promise<{ exists: boolean }> {
    const existingCEO = await this.userRepo.findOne({
      where: { role: { name: 'CEO' } },
      relations: ['role'],
    });
    return { exists: !!existingCEO };
  }

  // 🔹 SEND PASSWORD RESET LINK
  async forgotPassword(email: string, mailerService: MailerService) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. </p>`,
    });

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload: any = this.jwtService.verify(token);
      const hashed = await bcrypt.hash(newPassword, 10);
      await this.userRepo.update({ id: payload.sub }, { password: hashed });
      return { message: 'Password updated successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
