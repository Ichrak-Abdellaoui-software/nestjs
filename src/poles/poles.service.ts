/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PoleDto } from './dto/poles.dto';
import { Pole } from './models/poles.models';
@Injectable()
export class PolesService {
  constructor(@InjectModel(Pole.name) private PoleModel: Model<Pole>) {}
  async add(body: PoleDto) {
    try {
      return await this.PoleModel.create(body);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Pole name is already taken');
      }

      throw error;
    }
  }
  findAll() {
    return this.PoleModel.find();
  }
  findOne(id: string) {
    //return this.PoleModel.findOne({ _id: id });
    return this.PoleModel.findById(id);
  }
  delete(id: string) {
    return this.PoleModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: PoleDto) {
    return this.PoleModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.PoleModel.find(keyword);
  }
}
