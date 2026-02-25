import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('register')
    register(@Body() dto: any) {
        return this.auth.register(dto);
    }

    @Post('login')
    login(@Body() dto: any) {
        return this.auth.login(dto);
    }
}