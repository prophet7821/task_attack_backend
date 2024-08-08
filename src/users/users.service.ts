//users.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: User) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      throw new BadRequestException("Invalid email address");
    }

    const newUser = new this.userModel(userData);
    try {
      return await newUser.save();
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.email) {
          throw new ConflictException("Email is already registered");
        }
      }
      throw new InternalServerErrorException("Something went wrong!!");
    }
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
