import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Controller('test')
export class TestController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Get()
    async testDb() {
        try {
            const result = await this.databaseService.query("SELECT * FROM users")
            console.log("Users", result.rows)
            return result.rows
        } catch (error) {
            console.error("Error fetching users:", error)
            throw error
        }
    }
}
