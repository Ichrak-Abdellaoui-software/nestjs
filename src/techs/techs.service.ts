/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Injectable } from '@nestjs/common';
import { Tech } from './models/techs.models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TechDto } from './dto/techs.dto';

@Injectable()
export class TechsService {
  constructor(@InjectModel(Tech.name) private TechModel: Model<Tech>) {}
  add(body: TechDto) {
    return this.TechModel.create(body);
  }
  getAll() {
    return this.TechModel.find();
  }
  getOne(id: string) {
    //return this.TechModel.findOne({ _id: id });
    return this.TechModel.findById(id);
  }
  delete(id: string) {
    return this.TechModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: TechDto) {
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
