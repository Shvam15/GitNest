import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import bcrypt from "bcrypt"
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiResponse } from "src/common/responses/api-response";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService
    ) { }

    async signup(userDetails: SignupDto) {

        if (!userDetails?.email || !userDetails?.password) {
            throw new Error("Email and password are required")
        }
        const user = await this.usersRepository.findByEmail(userDetails?.email)

        // user already exists
        if (user) {
            return new ApiResponse(false, "User already exists", null);
        }

        // hash password
        const hashedPassword = await bcrypt.hash(userDetails?.password, 10)

        // add new user
        const newUser = await this.usersRepository.createUser(userDetails?.user_name, userDetails?.email, hashedPassword)

        const payload = {
            sub: newUser?.id,
            email: newUser?.email,
            username: newUser?.username
        }

        // generate jwt token
        const accessToken = await this.jwtService.signAsync(payload)

        const { password, ...safeUser } = newUser

        // return new user
        return new ApiResponse(true, 'User created successfully', {
            safeUser,
            accessToken
        })
    }

    async login(userDetails: LoginDto) {

        const user = await this.usersRepository.findByEmail(userDetails?.email)
        if (!user) {
            throw new Error('User not found')
        }

        
        // compare password
        const isPasswordValid = await bcrypt.compare(userDetails?.password, user?.password)
        if (!isPasswordValid) {
            return new ApiResponse(false, 'Email or password is wrong', null);
        }

        // create jwt payload
        const payload = {
            sub: user?.id,
            email: user?.email,
            username: user?.username
        }

        // generate jwt token
        const accessToken = await this.jwtService.signAsync(payload)

        const { password, ...safeUser } = user

        // return user
        return new ApiResponse(true, 'User logged in successfully', {
            safeUser,
            accessToken
        })
    }
}