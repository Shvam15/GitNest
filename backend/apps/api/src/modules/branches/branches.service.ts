import { Injectable } from "@nestjs/common"
import { BranchesRepository } from "./branches.repository"
import { ApiResponse } from "src/common/responses/api-response"
import { CreateBranchDto } from "./dto/create-branch.dto"

@Injectable()
export class BranchesService {

    constructor(
        private readonly branchesRepository: BranchesRepository,
    ) { }

    async createBranch(user: any, body: CreateBranchDto) {
        const newBranch = await this.branchesRepository.createBranch(user, body)
        if (!newBranch) {
            throw new Error('Failed to create branch')
        }

        return new ApiResponse(true, 'Branch created successfully', newBranch)
    }

}