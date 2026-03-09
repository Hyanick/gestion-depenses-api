import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { CurrentUser } from './current-user.decorator';
import type { CurrentUserType } from './current-user.decorator';
import { JwtAuthGuard } from './jwt.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    private setRefreshCookie(res: Response, token: string) {
        res.cookie(this.auth.getRefreshCookieName(), token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/api/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
    }

    private clearRefreshCookie(res: Response) {
        res.clearCookie(this.auth.getRefreshCookieName(), { path: '/api/auth/refresh' });
    }

    private getMeta(req: Request) {
        return {
            ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
                || req.socket?.remoteAddress
                || null,
            userAgent: req.headers['user-agent'] || null,
        };
    }

    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const out = await this.auth.register(dto, this.getMeta(req));
        this.setRefreshCookie(res, out.refreshToken);
        return { user: out.user, accessToken: out.accessToken };
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const out = await this.auth.login(dto, this.getMeta(req));
        this.setRefreshCookie(res, out.refreshToken);
        return { user: out.user, accessToken: out.accessToken };
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const cookieName = this.auth.getRefreshCookieName();
        const token = (req.cookies?.[cookieName] as string | undefined) ?? '';

        const payload = this.auth.verifyRefreshTokenOrThrow(token);
        const out = await this.auth.refresh(payload.sub, token, this.getMeta(req));

        this.setRefreshCookie(res, out.refreshToken);
        return { user: out.user, accessToken: out.accessToken };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(
        @CurrentUser() user: CurrentUserType,
        @Res({ passthrough: true }) res: Response,
    ) {
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