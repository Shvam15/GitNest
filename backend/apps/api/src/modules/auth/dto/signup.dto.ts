import { IsEmail, IsString, Length, Matches, } from 'class-validator';

export class SignupDto {
    @IsString()
    @Length(3, 30)
    user_name: string;

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