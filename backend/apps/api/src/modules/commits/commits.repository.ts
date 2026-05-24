import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateCommitDto } from "./dto/create-commits.dto";
import { ApiResponse } from "src/common/responses/api-response";
import { createFileStorage, storeSnapshots } from "src/common/utils";

@Injectable()
export class CommitsRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async createCommit(user: any, body: CreateCommitDto) {
        // extract details from the body
        const { message, repoId, branchId, files } = body

        if (!message) return ('Commit message can not be empty! ')

        const client = await this.databaseService.getClient();

        // use transcation
        try {

            await client.query('BEGIN')

            // check repo exists 
            const checkRepoExists = await this.databaseService.query('SELECT * FROM repositories where id = $1', [repoId])

            if (!checkRepoExists?.rows[0]) {
                throw new Error("Repository does not exist")
            }
            const checkBranchExists = await this.databaseService.query('SELECT * FROM branches where id = $1', [branchId])

            if (!checkBranchExists?.rows[0]) {
                throw new Error("Repository does not exist")
            }

            // validate branch belongs to repository
            if (checkBranchExists.rows[0].repository_id !== repoId) {
                throw new Error('Branch does not belong to this repository');
            }

            // get latest commit from branch
            const latestCommitId =
                checkBranchExists.rows[0].latest_commit_id || null;

            // create commit
            const createCommitQuery = `
                INSERT INTO commits
                (
                    message,
                    repository_id,
                    branch_id,
                    parent_commit_id,
                    created_by
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;

            const commitData = await client.query(
                createCommitQuery,
                [
                    message,
                    repoId,
                    branchId,
                    latestCommitId,
                    user?.id
                ]
            );

            const createdCommit = commitData.rows[0];
            const payloadForFileStorage = {
                ...body,
                id: createdCommit.id
            }

            // update branch latest commit pointer
            const updateBranchQuery = `
                UPDATE branches
                SET latest_commit_id = $1
                WHERE id = $2
                RETURNING *;
                `;

            const updatedBranch = await client.query(
                updateBranchQuery,
                [
                    createdCommit.id,
                    branchId
                ]
            );

            await client.query('COMMIT');

            // create file storage
            if (createdCommit.id) {
                const fileStorage = await createFileStorage({
                    user,
                    body: payloadForFileStorage,
                    type: 'commit'
                })

                // store snapshot of the files
                if (files && files.length > 0) {
                    for (const file of files || []) {
                        await storeSnapshots({
                            user,
                            body: payloadForFileStorage,
                            type: 'commit',
                            files: [file]
                        })
                    }
                    console.log(fileStorage)
                    return fileStorage
                }
                return fileStorage
            }

            return {
                commit: createdCommit,
                branch: updatedBranch.rows[0]
            };
        } catch (error) {

            await client.query('ROLLBACK');
            throw error;

        } finally {

            client.release();

        }

    }
    async getCommitHistory(user: any, body: any) {
        const { repoId, branchId } = body

        const client = await this.databaseService.getClient();

        try {

            // check repo and branch exists
            const checkRepoExists = await client.query('SELECT * FROM repositories where id = $1', [repoId])
            if (!checkRepoExists?.rows[0]) {
                throw new Error("Repository does not exist")
            }
            const checkBranchExists = await client.query('SELECT * FROM branches where id = $1', [branchId])
            if (!checkBranchExists?.rows[0]) {
                throw new Error("Branch does not exist")
            }

            // validate branch belongs to repository
            if (checkBranchExists.rows[0].repository_id !== repoId) {
                throw new Error('Branch does not belong to this repository');
            }

            // fetch latest commit from the branch table and commit table
            const latestCommit = await client.query('SELECT * FROM branches where id = $1', [branchId])

            const latestCommitId = latestCommit?.rows[0]?.latest_commit_id || null


            if (!latestCommitId) {
                return new ApiResponse(true, 'No commits found', [])
            }

            let currentCommitId = latestCommitId
            const history: any = []

            while (currentCommitId) {
                const fetchParentCommit = await client.query('SELECT * FROM commits where id = $1', [currentCommitId])

                const parentCommit = fetchParentCommit?.rows[0]

                if (!parentCommit) {
                    break;
                }
                history.push(parentCommit)
                currentCommitId = parentCommit.parent_commit_id
            }

            return new ApiResponse(true, 'Commit history fetched successfully', history)

        } catch (error) {
            throw new Error("error", error)
        } finally {
            client.release();
        }
    }


}