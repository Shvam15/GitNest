import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() userDetails: SignupDto) {
        return this.authService.signup(userDetails);
    }

    @Post('login')
    async login(@Body() userDetails: LoginDto) {
        return this.authService.login(userDetails);
    }
}