import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './models/questions.models';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Tech } from 'src/techs/models/techs.models';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
    @InjectModel(Tech.name) private TechModel: Model<Tech>,
  ) {}
  async add(body: CreateQuestionDto) {
    const question = await this.QuestionModel.create(body);
    await Promise.all(
      body.techs.map((techId) =>
        this.TechModel.findByIdAndUpdate(
          techId,
          { $addToSet: { questions: question._id } },
          { new: true },
        ),
      ), // test with JSON not Form-Encode ( sinon problem f array )
    );

    return question;
  }

  findAll() {
    return this.QuestionModel.find();
  }
  findOne(id: string) {
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
