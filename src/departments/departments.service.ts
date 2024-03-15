/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Injectable } from '@nestjs/common';
import { Department } from './models/departments.models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DepartmentDto } from './dto/departments.dto';
@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private DepartmentModel: Model<Department>,
  ) {}
  add(body: DepartmentDto) {
    return this.DepartmentModel.create(body);
  }
  getAll() {
    return this.DepartmentModel.find();
  }
  getOne(id: string) {
    //return this.DepartmentModel.findOne({ _id: id });
    return this.DepartmentModel.findById(id);
  }
  delete(id: string) {
    return this.DepartmentModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: DepartmentDto) {
    return this.DepartmentModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.DepartmentModel.find(keyword);
  }
}
