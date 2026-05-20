import { Module } from "@nestjs/common";
import { BranchesService } from "./branches.service";
import { BranchesController } from "./branches.controller";
import { BranchesRepository } from "./branches.repository";

@Module({
    providers: [BranchesService, BranchesRepository],
    exports: [BranchesService, BranchesRepository],
    controllers: [BranchesController],
})
export class BranchesModule { }
