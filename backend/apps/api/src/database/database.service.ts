import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class DatabaseService {
    private pool: Pool

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })
    }

    async onModuleInit() {
        try {
            const client = await this.pool.connect();
            console.log('Database connected successfully');
            client.release();
        } catch (error) {
            console.error('Database connection failed:', error);
        }
    }


    async query(query: string, params?: any[]) {
        return this.pool.query(query, params)
    }
}