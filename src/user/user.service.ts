import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

import { Role } from 'src/roles/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  // Update profile
  async updateProfile(id: string, patch: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, patch);
    const saved = await this.userRepo.save(user);

    // Remove password before returning
    const { password: _, ...rest } = saved as any;
    return rest;
  }

  // List all users
  async listAll() {
    const users = await this.userRepo.find({ relations: ['role'] }); // singular relation
    return users.map((u) => {
      const { password: _, ...rest } = u as any;
      return rest;
    });
  }
}
