import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async createRole(name: string, permissionKeys: string[]) {
    const permissions = await this.permRepo.find({
      where: { key: In(permissionKeys) },
    });

    const role = this.roleRepo.create({
      name,
      permissions,
    });

    return this.roleRepo.save(role);
  }

  async findByName(name: string) {
    return this.roleRepo.findOne({ where: { name } });
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ['permissions'] });
  }
}
