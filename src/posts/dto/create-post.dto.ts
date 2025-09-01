import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsString({message: "User id is required"})
    userId: string;

    @IsString({message: "Udid is requried"})
    udid: string;

    @IsString({message: "Text is required"})
    text: string;

    @IsOptional()
    images: Express.Multer.File[];

    @IsOptional()
    videos: Express.Multer.File[];
}