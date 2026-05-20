import { Module } from "@nestjs/common";
import { CommitsService } from "./commits.service";
import { CommitsController } from "./commits.controller";
import { CommitsRepository } from "./commits.repository";

@Module({
    providers: [CommitsService, CommitsRepository],
    exports: [CommitsService, CommitsRepository],
    controllers: [CommitsController],
})
export class CommitsModule { }
