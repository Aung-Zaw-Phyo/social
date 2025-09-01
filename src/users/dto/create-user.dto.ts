import { IsString } from "class-validator";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CreateUserDto {
    @IsString({message: "Name is required."})
    name: string;

    @IsString({message: "Phone is required."})
    phone: string;

    @IsString({message: "Udid is required."})
    udid: string;

    @IsString({message: "Imei is required."})
    imei: string;

    @IsString({message: "Mcc is required."})
    mcc: string;

    @IsString({message: "Mnc is required."})
    mnc: string;
}
