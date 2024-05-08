import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './models/questions.models';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Tech } from 'src/techs/models/techs.models';
import { User } from 'src/users/models/users.models';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
    @InjectModel(Tech.name) private TechModel: Model<Tech>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}
  async add(body: CreateQuestionDto) {
    const techs = await this.TechModel.find({
      _id: { $in: body.techs },
    });
    const techNames = techs.map((tech) => tech.name);

    const author = await this.UserModel.find({
      _id: { $in: body.author },
    });
    const authorName = author.map((user) => user.fullname);

    const question = await this.QuestionModel.create({
      ...body,
      techs: techNames,
      author: authorName,
    });
    await Promise.all(
      techs.map((tech) =>
        this.TechModel.findByIdAndUpdate(
          tech._id,
          { $addToSet: { questions: question._id } },
          { new: true },
        ),
      ),
    );

    await this.UserModel.findByIdAndUpdate(
      body.author,
      { $push: { questions: question._id } },
      { new: true },
    );

    return question;
  }

  //sorted by plus récente
  async findAll() {
    return await this.QuestionModel.find().sort({ createdAt: -1 }).exec();
  }
  //sorted by plus ancienne
  async findAllByOld() {
    return await this.QuestionModel.find();
  }
  //sorted by most seen
  async findAllByViews() {
    return await this.QuestionModel.find().sort({ views: -1 }).exec();
  }
  // get questions par une date
  async findQuestionsByDate(date: Date): Promise<Question[]> {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    return this.QuestionModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
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
    const keyword = key
      ? {
          $or: [
            { title: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
          ],
        }
      : {};
    return this.QuestionModel.find(keyword);
  }
  async incrementViews(id: string): Promise<number> {
    //Promise<Question>
    const question = await this.QuestionModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true },
    );

    // return question;
    return question.views;
  }
}
