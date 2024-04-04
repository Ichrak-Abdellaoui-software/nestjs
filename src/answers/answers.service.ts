import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './models/answers.models';
import { Model } from 'mongoose';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(@InjectModel(Answer.name) private AnswerModel: Model<Answer>) {}
  add(body: CreateAnswerDto) {
    return this.AnswerModel.create(body);
  }
  getAll() {
    return this.AnswerModel.find();
  }
  getOne(id: string) {
    //return this.AnswerModel.findOne({ _id: id });
    return this.AnswerModel.findById(id);
  }
  delete(id: string) {
    return this.AnswerModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: UpdateAnswerDto) {
    return this.AnswerModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.AnswerModel.find(keyword);
  }
}
