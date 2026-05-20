import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { BranchesService } from "./branches.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { CreateBranchDto } from "./dto/create-branch.dto";

@UseGuards(JwtAuthGuard)

@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post('create')
    async createBranch(@CurrentUser() user: any, @Body() body: CreateBranchDto) {
        return this.branchesService.createBranch(user, body);
    }

}