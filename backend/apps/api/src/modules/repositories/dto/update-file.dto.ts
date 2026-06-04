import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFileDto {
    @IsString()
    @IsNotEmpty()
    filePath: string

    @IsString()
    @IsNotEmpty()
    content: string
}