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
    const question = await this.QuestionModel.create(body);
    await Promise.all(
      body.techs.map((techId) =>
        this.TechModel.findByIdAndUpdate(
          techId,
          { $addToSet: { questions: question._id } }, // addtoset pour assurer que lquestion s ajoute pas plusieurs fois a la meme tech
          { new: true },
        ),
      ), // test with JSON not Form-Encode ( sinon problem f array )
    );
    await this.UserModel.findByIdAndUpdate(
      body.author,
      { $push: { questions: question._id } }, // peu importe les doublons
      { new: true },
    );
    //console.log('elkatb', body.author);
    return question;
  }

  //sorted by plus récente
  async findAll() {
    return await this.QuestionModel.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $addFields: {
          converted_tech_ids: {
            $map: {
              input: '$techs',
              as: 'techId',
              in: { $toObjectId: '$$techId' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'techs',
          localField: 'converted_tech_ids',
          foreignField: '_id',
          as: 'tech_details',
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          author: 1,
          image: 1,
          status: 1,
          views: 1,
          answers: 1,
          createdAt: 1,
          updatedAt: 1,
          techs: '$tech_details.name',
        },
      },
    ]).exec();
  }
  //sorted by plus ancienne
  async findAllByOld() {
    return await this.QuestionModel.aggregate([
      {
        $addFields: {
          converted_tech_ids: {
            $map: {
              input: '$techs',
              as: 'techId',
              in: { $toObjectId: '$$techId' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'techs',
          localField: 'converted_tech_ids',
          foreignField: '_id',
          as: 'tech_details',
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          author: 1,
          image: 1,
          status: 1,
          views: 1,
          answers: 1,
          createdAt: 1,
          updatedAt: 1,
          techs: '$tech_details.name',
        },
      },
    ]).exec();
  }
  //sorted by most seen
  async findAllByViews() {
    return await this.QuestionModel.aggregate([
      {
        $sort: { views: -1 },
      },
      {
        $addFields: {
          converted_tech_ids: {
            $map: {
              input: '$techs',
              as: 'techId',
              in: { $toObjectId: '$$techId' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'techs',
          localField: 'converted_tech_ids',
          foreignField: '_id',
          as: 'tech_details',
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          author: 1,
          image: 1,
          status: 1,
          views: 1,
          answers: 1,
          createdAt: 1,
          updatedAt: 1,
          techs: '$tech_details.name',
        },
      },
    ]).exec();
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
