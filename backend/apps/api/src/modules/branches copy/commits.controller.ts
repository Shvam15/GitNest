import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { CreateCommitDto } from "./dto/create-commits.dto";
import { CommitsService } from "./commits.service";

@UseGuards(JwtAuthGuard)

@Controller('commits')
export class CommitsController {
    constructor(private readonly commitService: CommitsService) { }

    @Post('create')
    async createCommit(@CurrentUser() user: any, @Body() body: CreateCommitDto) {
        return this.commitService.createCommit(user, body);
    }

}