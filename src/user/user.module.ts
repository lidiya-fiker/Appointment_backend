import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RequestModule } from 'src/requests/request.module';
import { RoleModule } from 'src/roles/role.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Role } from 'src/roles/role.entity';
import { Request } from 'src/requests/request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Request, Role]),
    forwardRef(() => RoleModule),
    forwardRef(() => RequestModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
