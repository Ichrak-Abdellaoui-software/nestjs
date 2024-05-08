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
import { Question } from 'src/questions/models/questions.models';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Pole.name) private PoleModel: Model<Pole>,
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
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
  /////////////////////////////////////////////////////////
  async findMostPosting(period: string): Promise<User[]> {
    const currentDate = new Date();

    let startDate: Date;
    if (period === 'week') {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(currentDate.setDate(diff));
    } else if (period === 'month') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
    } else if (period === 'year') {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
    } else {
      throw new Error('Invalid period');
    }

    const mostPosting = await this.QuestionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: '$author',
          totalQuestions: { $sum: 1 },
        },
      },
      {
        $sort: { totalQuestions: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: '$user._id',
          fullname: '$user.fullname',
          email: '$user.email',
          role: '$user.role',
          avatar: '$user.avatar',
          totalQuestions: '$totalQuestions',
        },
      },
    ]);

    return mostPosting;
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
