import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiResponse } from "src/common/responses/api-response";

@Controller("users")
export class UsersController {
    @UseGuards(JwtAuthGuard)
    @Get("me")
    async getMe(@Req() req: any) {
        return new ApiResponse(true, "User details fetched successfully", req.user)
    }
}