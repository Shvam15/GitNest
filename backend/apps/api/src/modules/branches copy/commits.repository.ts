import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateCommitDto } from "./dto/create-commits.dto";

@Injectable()
export class CommitsRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async createCommit(user: any, body: CreateCommitDto) {
        
    }
    
}