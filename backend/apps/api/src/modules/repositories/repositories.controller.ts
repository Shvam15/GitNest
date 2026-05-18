import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { RepositoriesService } from "./repositories.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateRepositoryDto } from "./dto/create-repo.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)

@Controller('repositories')
export class RepositoriesController {
    constructor(private readonly repositoriesService: RepositoriesService) { }

    @Post('/create')
    async createRepo(@CurrentUser() user: any, @Body() repoDetails: CreateRepositoryDto) {
        return this.repositoriesService.createRepository(user, repoDetails)
    }

    @Get('/me')
    async getUserRepositories(@CurrentUser() user: any) {
        return this.repositoriesService.getUserRepositories(user?.id)
    }

    @Get('/:repo_id')
    async getRepository(@CurrentUser() user: any, @Param('repo_id') repo_id: string) {
        return this.repositoriesService.getRepositoryById(user, repo_id)
    }

    @Delete('/:repo_id')
    async deleteRepository(@CurrentUser() user: any, @Param('repo_id') repo_id: string) {
        return this.repositoriesService.deleteRepository(user, repo_id)
    }
}