import { DatabaseService } from "src/database/database.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async findByEmail(email: string) {
        const queryText = `SELECT * FROM users WHERE email = $1`
        const result = await this.databaseService.query(queryText, [email])
        return result?.rows[0]
    }

    async createUser(user_name: string, email: string, password: string) {
        const query = 'INSERT INTO users (username,email,password) VALUES ($1, $2, $3) RETURNING *'
        const result = await this.databaseService.query(query, [user_name, email, password])
        return result?.rows[0]
    }
}