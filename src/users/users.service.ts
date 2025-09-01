import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { formatResponse } from 'src/common/helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existedUser = await this.userRepository.findOne({where: {phone: createUserDto.phone}});
    if(existedUser) {
      return formatResponse('User already created.', {userId: existedUser.userId, phone: existedUser.phone});
    }
    const userId = crypto.createHash('md5').update(createUserDto.phone).digest('hex');
    const userInstance = await this.userRepository.create({
      userId: userId,
      name: createUserDto.name,
      phone: createUserDto.phone,
      udid: createUserDto.udid,
      imei: createUserDto.imei,
      mcc: createUserDto.mcc,
      mnc: createUserDto.mnc,
    });
    const user = await this.userRepository.save(userInstance);
    return formatResponse('User created successfully.', {userId: user.userId, phone: user.phone});
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({where: {userId}})
    if(!user) {
      throw new HttpException({message: "User not found", error: "Not Found", statusCode: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND)
    }
    return user;
  }
}
