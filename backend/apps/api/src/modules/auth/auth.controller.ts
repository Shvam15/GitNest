import {
    Body,
    Controller,
    Get,
    Post,
} from '@nestjs/common';

import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('signup')
    async signup(
        @Body() userDetails: SignupDto,
    ) {
        return this.authService.signup(userDetails);
    }

    @Post('login')
    async login(
        @Body() userDetails: LoginDTO,
    ) {
        return this.authService.login(userDetails);
    }
}