import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthLoginHistoryEntity } from './auth-login-history.entity';
import { AuthHistoryController } from './auth-login-history.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthLoginHistoryEntity]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController, AuthHistoryController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}