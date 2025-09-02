import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UsersService } from 'src/users/users.service';
import { formatResponse } from 'src/common/helper';
import * as crypto from 'crypto';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        private readonly userService: UsersService,
    ) {}

    async create(createPostDto: CreatePostDto, files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[];}) {
        await this.userService.findOne(createPostDto.userId);
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        const postId = crypto.createHash('md5').update(String(randomNumber)).digest('hex');
        const postInstance = new this.postModel({ 
            ...createPostDto, 
            postId,
            images: files?.images?.map((file) => file.filename) || [],
            videos: files?.videos?.map((file) => file.filename) || [],
        });
        const post = await postInstance.save();
        return formatResponse('Post created successfully.', post);
    }

    async findAll(pagination: PaginationDto) {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const search = pagination?.search;
        const skip = (page - 1) * limit;
        const filter = search ? {text: { $regex: search, $options: "i"}} : {}
        const posts = await this.postModel.find(filter).skip(skip).limit(limit).select("-__v").sort({createdAt: -1}).exec();
        const total = await this.postModel.countDocuments(filter).exec()
        return formatResponse('Post list.', {
            posts,
            total,
            page,
            limit,
        }) 
    }

    async findOne(id: string) {
        const post = await this.postModel.findOne({_id: id}).exec();
        if(!post) {
            throw new HttpException({
                message: "Post not found", error: "Not Found", statusCode: HttpStatus.NOT_FOUND}, 
                HttpStatus.NOT_FOUND
            )
        }
        return formatResponse('Post details.', post);
    }
}
