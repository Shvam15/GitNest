import {  IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBranchDto {
    @IsString()
    @IsNotEmpty()
    name: string    

    @IsString()
    @IsNotEmpty()
    repoId: string

    @IsString()
    @IsOptional()
    parentBranchId?: string

    @IsString()
    @IsOptional()
    createdBy?: string
}