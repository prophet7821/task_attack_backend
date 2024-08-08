//posts.service.ts
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Schema, Types} from "mongoose";
import {Post} from "./posts.schema";
import { isValidObjectId } from 'mongoose';

@Injectable()
export class PostsService {
  // Constructor injects the Post model.
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}


  async getAllPosts(authorName:string, author:string, page = 0, limit = 10): Promise<Post[]> {

    const match: any = {};

    // If author ID is provided, validate and add to match criteria
    if (author) {
      if (!isValidObjectId(author)) {
        return [];
      }
      match.authorId = new Types.ObjectId(author); // Ensure the author ID is treated as an ObjectId
    }

    // If authorName is provided, add regex matching to the pipeline
    if (authorName) {
      match['author.fullName'] = {
        $regex: new RegExp(authorName, 'i') // Case-insensitive partial match
      };
    }

    // Aggregation pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $match: match
      },
      {
        $project: {
          'author.password': 0
        }
      }
    ];

    // Add pagination if limit is specified
    if (limit !== -1) {
      pipeline.push(
          { $skip: page * limit },
          { $limit: limit }
      );
    }

    return this.postModel.aggregate(pipeline).exec();

  }

  async createPost(postData: { title: string; content: string; authorId: string }) {
    const post = new this.postModel(postData);
    return await post.save();
  }

  async getPostById(id: string): Promise<Post> {
    try {
      return await this.postModel.findById(id).populate('authorId', '-password').exec();
    } catch (e) {
      throw new NotFoundException("No Post Exists with that ID");
    }
  }
}
