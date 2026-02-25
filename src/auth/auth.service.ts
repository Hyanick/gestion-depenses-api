import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: any) {
    const existing = await this.users.findByUsername(dto.username);
    if (existing) throw new BadRequestException('Username déjà utilisé');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.users.create({
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      passwordHash: hash,
    });

    const token = await this.jwt.signAsync({
      sub: user.id,
      username: user.username,
    });

    return { token, user };
  }

  async login(dto: any) {
    const user = await this.users.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException();

    const token = await this.jwt.signAsync({
      sub: user.id,
      username: user.username,
    });

    return { token, user };
  }
}