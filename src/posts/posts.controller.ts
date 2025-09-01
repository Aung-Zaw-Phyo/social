import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import { CreatePostDto } from './dto/create-post.dto';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PaginationDto } from './dto/pagination.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ], {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = './uploads';
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    create(@Body() createPostDto: CreatePostDto, @UploadedFiles() files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[];}) {
        return this.postsService.create(createPostDto, files);
    }

    @Get()
    findAll(@Query() pagination: PaginationDto) {
        return this.postsService.findAll(pagination);
    }

    @Get("/:id")
    findOne(@Param("id") id: string) {
        return this.postsService.findOne(id);
    }
}
