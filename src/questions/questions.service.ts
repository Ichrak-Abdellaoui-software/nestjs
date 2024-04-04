import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './models/questions.models';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
  ) {}
  add(body: CreateQuestionDto) {
    return this.QuestionModel.create(body);
  }
  getAll() {
    return this.QuestionModel.find();
  }
  getOne(id: string) {
    //return this.QuestionModel.findOne({ _id: id });
    return this.QuestionModel.findById(id);
  }
  delete(id: string) {
    return this.QuestionModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: UpdateQuestionDto) {
    return this.QuestionModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.QuestionModel.find(keyword);
  }
}
