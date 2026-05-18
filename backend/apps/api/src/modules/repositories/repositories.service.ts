import { Injectable } from "@nestjs/common"
import { CreateRepositoryDto } from "./dto/create-repo.dto"
import { RepositoriesRepository } from "./repositories.repository"
import { ApiResponse } from "src/common/responses/api-response"

@Injectable()
export class RepositoriesService {

    constructor(
        private readonly repositoriesRepository: RepositoriesRepository,

    ) { }

    async createRepository(user: any, repoDetails: CreateRepositoryDto) {
        const newRepo = await this.repositoriesRepository.createRepository(user, repoDetails)
        if (!newRepo) {
            throw new Error('Failed to create repository')
        }

        return new ApiResponse(true, 'Repository created successfully', newRepo)
    }

    async getUserRepositories(ownerId: string) {
        if (!ownerId) {
            throw new Error('User ID is required')
        }

        const repositories = await this.repositoriesRepository.findByOwnerId(ownerId)
        return new ApiResponse(true, 'User repositories fetched successfully', repositories)
    }

    async getRepositoryById(user: any, repoId: string) {
        const repository = await this.repositoriesRepository.findById(user, repoId)
        if (!repository) {
            throw new Error('Repository not found')
        }

        return new ApiResponse(true, 'Repository fetched successfully', repository)
    }

    async deleteRepository(user: any, repoId: string) {
        const result = await this.repositoriesRepository.deleteRepository(user, repoId)
        if (!result) {
            throw new Error('Failed to delete repository')
        }

        return new ApiResponse(true, 'Repository deleted successfully', null)
    }
}