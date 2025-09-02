import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PostDocument = Post & Document

@Schema({timestamps: true})
export class Post {
    @Prop()
    postId: string;

    @Prop()
    userId: string;

    @Prop()
    udid: string;

    @Prop()
    text: string;

    @Prop([String])
    images: string[];

    @Prop([String])
    videos: string[];
}

const schema = SchemaFactory.createForClass(Post);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: any) => {
        ret['id'] = ret._id;
        delete ret._id
    }
})

export const PostSchema = schema;