import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { ACCESS_TOKEN_TTL, REFRESH_COOKIE_NAME, REFRESH_TOKEN_TTL } from './auth.constants';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

type Tokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  private accessSecret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
  ) { }

  private signTokens(user: UserEntity): Tokens {
    const payload = { sub: user.id, username: user.username };

    const accessToken = this.jwt.sign(payload, {
      secret: this.accessSecret,
      expiresIn: ACCESS_TOKEN_TTL,
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }

  private async setRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.users.update({ id: userId }, { refreshTokenHash: hash });
  }

  async register(dto: RegisterDto) {
    const contactOk = !!(dto.email?.trim() || dto.phone?.trim());
    if (!contactOk) throw new BadRequestException('Email ou téléphone requis.');

    const exists = await this.users.findOne({
      where: [{ username: dto.username }, { email: dto.email }, { phone: dto.phone }],
    });

    if (exists) throw new BadRequestException('Utilisateur déjà existant.');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.users.save(
      this.users.create({
        name: dto.name.trim(),
        username: dto.username.trim(),
        email: dto.email?.trim() || null,
        phone: dto.phone?.trim() || null,
        passwordHash,
      }),
    );
    await this.users.update({ id: user.id }, { lastLoginAt: new Date() });

    const tokens = this.signTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, username: user.username },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken, // on le met aussi en cookie côté controller
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('Identifiants invalides.');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Identifiants invalides.');

    const tokens = this.signTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);
    await this.users.update({ id: user.id }, { lastLoginAt: new Date() });

    return {
      user: { id: user.id, name: user.name, username: user.username },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    await this.users.update({ id: userId }, { refreshTokenHash: null });
    return { ok: true };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Refresh invalide.');

    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) throw new UnauthorizedException('Refresh invalide.');

    const tokens = this.signTokens(user);
    // rotation
    await this.setRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, username: user.username },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // utile si tu veux /me
  async getMe(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone };
  }

  verifyRefreshTokenOrThrow(token: string) {
    try {
      return this.jwt.verify(token, { secret: this.refreshSecret }) as { sub: string; username: string };
    } catch {
      throw new UnauthorizedException('Refresh expiré ou invalide.');
    }
  }

  getRefreshCookieName() {
    return REFRESH_COOKIE_NAME;
  }

}