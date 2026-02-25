import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import type { CurrentUserType } from './current-user.decorator';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt.guard';


@Controller('api/auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    private setRefreshCookie(res: Response, token: string) {
        res.cookie(this.auth.getRefreshCookieName(), token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // ✅ true en prod HTTPS
            path: '/api/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 jours
        });
    }

    private clearRefreshCookie(res: Response) {
        res.clearCookie(this.auth.getRefreshCookieName(), { path: '/api/auth/refresh' });
    }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const out = await this.auth.register(dto);
        this.setRefreshCookie(res, out.refreshToken);
        return { user: out.user, accessToken: out.accessToken };
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const out = await this.auth.login(dto);
        this.setRefreshCookie(res, out.refreshToken);
        return { user: out.user, accessToken: out.accessToken };
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const cookieName = this.auth.getRefreshCookieName();
        const token = (req.cookies?.[cookieName] as string | undefined) ?? '';

        const payload = this.auth.verifyRefreshTokenOrThrow(token);
        const out = await this.auth.refresh(payload.sub, token);

        this.setRefreshCookie(res, out.refreshToken);
        return { user: out.user, accessToken: out.accessToken };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@CurrentUser() user: CurrentUserType, @Res({ passthrough: true }) res: Response) {
        await this.auth.logout(user.id);
        this.clearRefreshCookie(res);
        return { ok: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user: CurrentUserType) {
        return this.auth.getMe(user.id);
    }
}