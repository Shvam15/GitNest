import { Injectable } from "@nestjs/common"
import { CommitsRepository } from "./commits.repository"
import { ApiResponse } from "src/common/responses/api-response"
import { CreateCommitDto } from "./dto/create-commits.dto"

@Injectable()
export class CommitsService {

    constructor(
        private readonly commitsRepository: CommitsRepository,
    ) { }

    async createCommit(user: any, body: CreateCommitDto) {
        const newCommit = await this.commitsRepository.createCommit(user, body)
        if (!newCommit) {
            throw new Error('Failed to create commit')
        }

        return new ApiResponse(true, 'Commit created successfully', newCommit)
    }

    async getCommitHistory(user: any, query: any) {
        const commitHistory = await this.commitsRepository.getCommitHistory(user, query)
        if (!commitHistory) {
            throw new Error('Failed to get commit history')
        }

        return new ApiResponse(true, 'Commit history fetched successfully', commitHistory)
    }



}