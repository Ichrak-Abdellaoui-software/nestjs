import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/users.models';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  add(body: CreateUserDto) {
    return this.UserModel.create(body);
  }
  getAll() {
    return this.UserModel.find();
  }
  getOne(id: string) {
    //return this.UserModel.findOne({ _id: id });
    return this.UserModel.findById(id);
  }
  delete(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
  update(id: string, body: UpdateUserDto) {
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
