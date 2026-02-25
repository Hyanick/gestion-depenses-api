import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    name!: string;

    @IsString()
    username!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}