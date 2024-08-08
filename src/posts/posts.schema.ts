//posts.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {HydratedDocument, Schema as mongooseSchema} from "mongoose";
import {User} from "../users/users.schema";

export type PostDocument = HydratedDocument<Post>;
@Schema({ collection: "posts", timestamps: true})
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: "User", required: true })
  authorId: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
