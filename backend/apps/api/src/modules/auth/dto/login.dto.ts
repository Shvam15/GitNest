import { IsEmail, IsString, Length, Matches, } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 50)
    @Matches(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
    })
    @Matches(/[0-9]/, {
        message: 'Password must contain at least one number',
    })
    password: string;
}