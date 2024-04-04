/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PoleDto } from './dto/poles.dto';
import { Pole } from './models/poles.models';
@Injectable()
export class PolesService {
  constructor(@InjectModel(Pole.name) private PoleModel: Model<Pole>) {}
  add(body: PoleDto) {
    return this.PoleModel.create(body);
  }
  getAll() {
    return this.PoleModel.find();
  }
  getOne(id: string) {
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
