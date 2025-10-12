import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/roles/role.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  // Update profile — only allowed fields
  async updateProfile(id: string, patch: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Only update allowed properties
    Object.assign(user, {
      firstName: patch.firstName ?? user.firstName,
      lastName: patch.lastName ?? user.lastName,
      middleName: patch.middleName ?? user.middleName,
      phone: patch.phone ?? user.phone,
      gender: patch.gender ?? user.gender,
      photo: patch.photo ?? user.photo,
    });

    const saved = await this.userRepo.save(user);

    // Exclude password before returning
    const { password: _password, ...rest } = saved;
    return rest;
  }

  // List all users
  async listAll() {
    const users = await this.userRepo.find({ relations: ['role'] });
    return users.map(({ password: _password, ...rest }) => rest);
  }
}
