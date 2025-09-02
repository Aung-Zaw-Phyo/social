import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "mysql",
                host: configService.getOrThrow('MYSQL_HOST'),
                port: configService.getOrThrow('MYSQL_PORT'),
                database: configService.getOrThrow('MYSQL_DATABASE'),
                username: configService.getOrThrow('MYSQL_USER'),
                password: configService.getOrThrow('MYSQL_PASSWORD'),
                synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
                autoLoadEntities: true,
                logging: true,
                subscribers: [],
                migrations: [],
            }),
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URL')
            })
        }),
    ]
})

export class DatabaseModule {}

