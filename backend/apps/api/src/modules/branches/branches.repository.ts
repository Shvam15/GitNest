import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateBranchDto } from "./dto/create-branch.dto";

@Injectable()
export class BranchesRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async createBranch(user: any, body: CreateBranchDto) {
        const { repoId, name, parentBranchId } = body;
        const client = await this.databaseService.getClient();

        try {
            await client.query('BEGIN');

            const checkParentBranchIdExists = await client.query(`
                SELECT * FROM branches WHERE repository_id = $1 AND id = $2
            `, [repoId, parentBranchId]);

            if (!checkParentBranchIdExists?.rows[0]) {
                throw new Error('Parent branch does not exist');
            }

            const getLatestCommitForParentBranch = await client.query(`
                SELECT * FROM commits WHERE id = $1
            `, [checkParentBranchIdExists?.rows[0]?.latest_commit_id]);

            const latestCommit = getLatestCommitForParentBranch?.rows[0] || null;

            // create branch
            const query = `
                INSERT INTO branches (repository_id, name, parent_branch_id, latest_commit_id, created_by)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;

            const branch = await client.query(query, [repoId, name, parentBranchId || null, latestCommit?.id || null, user?.id || null]);

            await client.query('COMMIT');

            return branch?.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

}