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

}