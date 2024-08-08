//auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../users/users.schema";
import MongooseClassSerializerInterceptor from "../interceptors/mongooseClassSerializer.interceptor";
import { JwtAuthGuard } from "../guards/auth.guard";
import { User as UserDecorator } from "../decorator/user.decorator";

@Controller({
  version: "1",
})
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password
    );
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }

  @Post("signUp")
  async signUp(@Body() userData: User) {
    return await this.authService.createUser(userData);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@UserDecorator() user: User) {
    return user;
  }
}
