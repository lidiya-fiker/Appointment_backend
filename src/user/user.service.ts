import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Record<string, any>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);

    const updated = await this.userRepository.save(user);
    return instanceToPlain(updated);
  }

  async getAllUsers(): Promise<Record<string, any>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => instanceToPlain(user));
  }
}
