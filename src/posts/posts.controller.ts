// posts.controller.ts
import {Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards} from "@nestjs/common";
import { PostsService } from "./posts.service";
import {JwtAuthGuard} from "../guards/auth.guard";
import { User as UserDecorator } from "../decorator/user.decorator";
import { UserDocument} from "../users/users.schema";

@Controller({
  path: "post",
  version: "1",
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("author") author ?: string,
    @Query("authorName") authorName ?: string
  ) {
    return this.postsService.getAllPosts(authorName, author, +page, +limit); // Convert strings to numbers with the unary plus operator
  }



  @UseGuards(JwtAuthGuard)
  @Get('/myPosts')
  async getPosts(
      @Query("page", ParseIntPipe) page: number,
      @Query("limit", ParseIntPipe) limit: number,
      @UserDecorator() user: UserDocument){
    return this.postsService.getAllPosts(undefined,user._id.toString(), +page, +limit);
  }

  @Get(":id")
    async getPostById(@Param("id") id: string) {
        return this.postsService.getPostById(id);
    }


  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() postData:{title: string, content: string}, @UserDecorator() user: UserDocument){
    return this.postsService.createPost({
      title: postData.title,
      content: postData.content,
      authorId: user._id.toString()
    });
  }
}
