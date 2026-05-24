import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateRepositoryDto } from "./dto/create-repo.dto";
import { createFileStorage } from "src/common/utils";

@Injectable()
export class RepositoriesRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async createRepository(user: any, repoDetails: CreateRepositoryDto) {
        const { name, description, is_private } = repoDetails
        const client = await this.databaseService.getClient();

        try {
            await client.query('BEGIN');

            // create repo
            const query = 'INSERT INTO repositories(owner_id, name,description,is_private) VALUES ($1, $2, $3, $4) RETURNING *'
            const repoResult = await client.query(query, [
                user?.id,
                name,
                description,
                is_private ? true : false
            ]);

            const repo = repoResult?.rows[0]

            // create default branch
            const branchQuery = `
                INSERT INTO branches (repository_id, name)
                VALUES ($1, $2)
                RETURNING *;
            `;

            const branch = await client.query(branchQuery, [repo?.id, 'main']);

            // create file storage

            await client.query('COMMIT');
            await createFileStorage({ user, body: repo, type: 'repo' })
            
            return {
                ...repo,
                defaultBranch: branch?.rows[0]
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async findByOwnerId(ownerId: string) {
        const query = `
            SELECT r.*,b.name as default_branch
            FROM repositories r
            JOIN branches b ON r.id=b.repository_id
            WHERE r.owner_id = $1 AND b.name='main'
        `
        const result = await this.databaseService.query(query, [ownerId])
        return result?.rows
    }

    async findById(user: any, repoId: string) {
        const query = 'SELECT * FROM repositories WHERE owner_id = $1 AND id = $2'
        const result = await this.databaseService.query(query, [user?.id, repoId])
        return result?.rows[0]
    }

    async deleteRepository(user: any, repoId: string) {
        const query = 'DELETE FROM repositories WHERE owner_id = $1 AND id = $2 RETURNING *'
        const result = await this.databaseService.query(query, [user?.id, repoId])
        return result?.rows[0]
    }
}