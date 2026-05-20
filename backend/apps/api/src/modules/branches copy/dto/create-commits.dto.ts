import {  IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommitDto {
    @IsString()
    @IsNotEmpty()
    name: string    

    @IsString()
    @IsNotEmpty()
    repoId: string

    @IsString()
    @IsOptional()
    branchId?: string

    @IsString()
    @IsOptional()
    createdBy?: string

    @IsString()
    @IsOptional()
    message?: string
}