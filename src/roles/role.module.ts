import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { User } from 'src/user/user.entity';
import { Permission } from './permission.entity';
import { RoleService } from './role.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Permission])],
  controllers: [RolesController],
  providers: [RoleService],
  exports: [TypeOrmModule, RoleService],
})
export class RoleModule {}
