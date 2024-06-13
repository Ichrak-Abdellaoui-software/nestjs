/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { Tech } from './models/techs.models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TechDto } from './dto/techs.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Injectable()
export class TechsService {
  constructor(@InjectModel(Tech.name) private TechModel: Model<Tech>) {}
  async add(body: TechDto) {
    try {
      return await this.TechModel.create(body);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Tech name is already taken');
      }

      throw error;
    }
  }
  findAll() {
    return this.TechModel.find({}, '-questions');
  }
  findOne(id: string) {
    //return this.TechModel.findOne({ _id: id });
    return this.TechModel.findById(id);
  }
  delete(id: string) {
    return this.TechModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: UpdateTechDto) {
    return this.TechModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.TechModel.find(keyword);
  }
}
