import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/users.models';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Pole } from 'src/poles/models/poles.models';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Pole.name) private PoleModel: Model<Pole>,
  ) {}
  async add(body: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newUser = new this.UserModel({
        ...body,
        password: hashedPassword,
      });

      const createdUser = await newUser.save();

      await this.PoleModel.findOneAndUpdate(
        { name: body.pole },
        { $addToSet: { members: createdUser._id } }, // Use $addToSet to avoid duplicates
        { new: true, upsert: true }, // Upsert if pole doesn't exist
      );

      return createdUser;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new BadRequestException('Email already used');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  findAll() {
    return this.UserModel.find();
  }
  findOne(id: string) {
    //return this.UserModel.findOne({ _id: id });
    return this.UserModel.findById(id);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.UserModel.findOne({ email }).select('+password').exec();
  }
  delete(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
  async update(id: string, body: UpdateUserDto) {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return this.UserModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true, runValidators: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.UserModel.find(keyword);
  }
}
