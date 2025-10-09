import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'jakjgncrkyyh ruidfahyg idafygerauphg',
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: ['role', 'role.permissions'],
    });
    if (!user) throw new UnauthorizedException('Unauthorized');

    // Return a simplified user object for guards
    return {
      id: user.id,
      email: user.email,
      role: {
        name: user.role.name,
        permissions: user.role.permissions.map((p) => p.key), // string array
      },
    };
  }
}
