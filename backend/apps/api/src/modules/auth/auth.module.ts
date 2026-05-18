import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        UsersModule,

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => ({
                secret:
                    configService.get<string>("JWT_SECRET") || "supersecret",

                signOptions: {
                    expiresIn:
                        (configService.get<string>("JWT_EXPIRES_IN") || "7d") as any,
                },
            }),
        }),
    ],

    controllers: [AuthController],

    providers: [AuthService],

    exports: [AuthService],
})

export class AuthModule { }