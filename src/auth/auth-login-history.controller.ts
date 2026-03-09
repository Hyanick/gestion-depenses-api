import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CurrentUser } from './current-user.decorator';
import type { CurrentUserType } from './current-user.decorator';
import { AuthLoginHistoryEntity } from './auth-login-history.entity';
import { JwtAuthGuard } from './jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/auth/history')
export class AuthHistoryController {
  constructor(
    @InjectRepository(AuthLoginHistoryEntity)
    private readonly loginHistoryRepo: Repository<AuthLoginHistoryEntity>,
  ) {}

  @Get()
  async getMyHistory(@CurrentUser() user: CurrentUserType) {
    return this.loginHistoryRepo.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}