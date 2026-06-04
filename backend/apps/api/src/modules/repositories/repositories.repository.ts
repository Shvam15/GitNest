import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateRepositoryDto } from "./dto/create-repo.dto";
import { createFileStorage, getFileContent, getFileTree, saveFile, storeSnapshots } from "src/common/utils";
import { UpdateFileDto } from "./dto/update-file.dto";
import { join } from "path";

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

    async updateFile(user: any, repoId: string, payload: UpdateFileDto) {

        const { filePath, content } = payload
        console.log("payload", payload)
        const client = await this.databaseService.getClient();

        try {

            await client.query('BEGIN');

            const repoDetail = 'SELECT * FROM repositories WHERE id = $1 AND owner_id = $2'
            const repoResult = await client.query(repoDetail, [repoId, user?.id])
            const repo = repoResult?.rows[0]
            console.log("repo", repo)
            if (!repo) {
                throw new Error('Repository not found')
            }

            if (repo?.owner_id !== user?.id) {
                throw new Error('You are not authorized to update this repository')
            }

            const branch = await client.query(`SELECT * FROM branches WHERE repository_id = $1 LIMIT 1`, [repoId])
            const branchId = branch.rows[0]?.id

            if (!branchId) {
                throw new Error("No branch found")
            }

            const saveFileResult = await saveFile(repoId, filePath, content)

            const newCommit = await client.query(`
                INSERT INTO commits (repository_id, branch_id,created_by, message, created_at,parent_commit_id)
                VALUES ($1, $2, $3, $4, $5,$6)
                RETURNING *;
            `, [
                repoId,
                branchId,
                user?.id,
                'Update file',
                new Date(),
                null
            ])
            await client.query('COMMIT');
            return {
                ...newCommit?.rows[0],
                file: saveFileResult
            }

        } catch (error) {
            await client.query('ROLLBACK');
            console.log("error in updateFile", error)
            throw error
        } finally {
            client.release();
        }
    }

    async getRepositoryTree(
        user: any,
        repoId: string
    ) {
        const repo = await this.databaseService.query(
            `SELECT * FROM repositories WHERE id = $1`,
            [repoId]
        );

        if (!repo.rows[0]) {
            throw new Error('Repository not found');
        }

        const repoPath = join('../../../GitNestData',
            repoId
        );
        console.log("repoPath", repoPath)

        const tree = await getFileTree(repoPath);
        console.log("tree", tree)

        return tree;
    }

    async getFileContent(user: any, repoId: string, filePath: string) {
        try {
            
            const repo = await this.databaseService.query(
                `SELECT * FROM repositories WHERE id = $1`,
                [repoId]
            );

            if (!repo.rows[0]) {
                throw new Error('Repository not found');
            }

            const repoPath = join('../../../GitNestData',
                repoId
            );
            console.log("repoPath", repoPath)

            const fileContent = await getFileContent(repoPath, filePath);
            console.log("fileContent", fileContent)

            return fileContent;

        } catch (error) {
            console.log("error in getFileContent", error)
            throw error
        }
    }
}