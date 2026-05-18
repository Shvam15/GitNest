import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRepositoryDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description?: string

    @IsBoolean()
    @IsOptional()
    is_private: boolean = false
}