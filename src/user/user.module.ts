import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Request } from 'src/requests/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Request])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {}
