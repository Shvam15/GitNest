import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { RepositoriesService } from "./repositories.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateRepositoryDto } from "./dto/create-repo.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
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

    @Post('/:repo_id/files')
    async updateFile(@CurrentUser() user: any, @Param('repo_id') repo_id: string, @Body() payload: UpdateFileDto ) {
        return this.repositoriesService.updateFile(user, repo_id, payload)
    }

    @Get('/:repo_id/tree')
    async getTree(@CurrentUser() user: any, @Param('repo_id') repo_id: string) {
        return this.repositoriesService.getRepositoryTree(user, repo_id)
    }

    @Get('/:repo_id/file')
    async getFiles(@CurrentUser() user: any, @Param('repo_id') repo_id: string , @Query('path') file_path: string ) {
        return this.repositoriesService.getFileContent(user, repo_id, file_path)
    }
}