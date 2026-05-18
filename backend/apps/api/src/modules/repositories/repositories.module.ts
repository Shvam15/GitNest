import { Module } from "@nestjs/common";
import { RepositoriesService } from "./repositories.service";
import { RepositoriesController } from "./repositories.controller";
import { RepositoriesRepository } from "./repositories.repository";

@Module({
    providers: [RepositoriesService, RepositoriesRepository],
    exports: [RepositoriesService, RepositoriesRepository],
    controllers: [RepositoriesController],
})
export class RepositoriesModule { }
