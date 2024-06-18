import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './models/questions.models';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Tech } from '../techs/models/techs.models';
import { User } from '../users/models/users.models';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  constructor(
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
    @InjectModel(Tech.name) private TechModel: Model<Tech>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}
  async add(
    body: CreateQuestionDto,
    userId: string,
    files?: Express.Multer.File[],
  ): Promise<Question> {
    const mediaUrls = files
      ? files.map((file) => `/uploads/medias/${file.filename}`)
      : [];
    const newQuestionData = {
      ...body,
      author: userId,
      media: mediaUrls,
    };
    const question = await this.QuestionModel.create(newQuestionData);
    await Promise.all(
      body.techs.map((techId) =>
        this.TechModel.findByIdAndUpdate(
          techId,
          { $addToSet: { questions: question._id } }, // addtoset pour assurer que la question ne s'ajoute pas plusieurs fois à la même tech
          { new: true },
        ),
      ), // test with JSON not Form-Encode ( sinon problem f array )
    );
    await this.UserModel.findByIdAndUpdate(
      userId,
      { $push: { questions: question._id } }, // peu importe les doublons
      { new: true },
    );
    return question;
  }

  //sorted by plus récente
  async findAll() {
    return await this.QuestionModel.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'techs', select: 'name _id' })
      .populate({
        path: 'author',
        model: 'User',
        populate: {
          path: 'pole',
          select: 'name _id',
        },
      })
      .populate({ path: 'answers', model: 'Answer' })
      .select(
        'title author description techs status views answers createdAt updatedAt media',
      )
      .exec();
  }
  //sorted by plus ancienne
  findAllByOld() {
    return this.QuestionModel.find()
      .populate({ path: 'techs', model: 'Tech' })
      .populate('author')
      .populate({ path: 'answers', model: 'Answer' })
      .exec();
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
    })
      .populate({ path: 'techs', model: 'Tech' })
      .populate('author')
      .populate({ path: 'answers', model: 'Answer' })
      .exec();
  }
  async findByUser(userId: string) {
    return await this.QuestionModel.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'techs', select: 'name _id' })
      .populate({
        path: 'author',
        model: 'User',
        populate: {
          path: 'pole',
          select: 'name _id',
        },
      })
      .populate({ path: 'answers', model: 'Answer' })
      .select(
        'title author description techs status views answers createdAt updatedAt media',
      )
      .exec();
  }
  async findOne(id: string) {
    await this.incrementViews(id);
    const question = await this.QuestionModel.findById(id)
      .populate({ path: 'techs', model: 'Tech' })
      .populate({ path: 'author', select: 'fullname avatar pole _id' })
      .populate({ path: 'answers', model: 'Answer' });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    await question.save();
    return question;
  }
  delete(id: string) {
    return this.QuestionModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: UpdateQuestionDto) {
    return this.QuestionModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    )
      .populate({ path: 'techs', model: 'Tech' })
      .populate('author')
      .populate({ path: 'answers', model: 'Answer' })
      .exec();
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
    return this.QuestionModel.find(keyword)
      .populate({ path: 'techs', model: 'Tech' })
      .populate('author')
      .populate({ path: 'answers', model: 'Answer' })
      .exec();
  }
  async incrementViews(id: string): Promise<number> {
    //Promise<Question>
    const question = await this.QuestionModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true },
    );
    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    // return question;
    return question.views;
  }

  async getTopViewedQuestions(): Promise<Question[]> {
    return this.QuestionModel.find()
      .sort({ views: -1 }) // Sort by views in descending order
      .limit(5) // Limit to top 5
      .populate({ path: 'answers', select: 'title _id' }) // Populate answers, selecting only title and _id
      .exec();
  }
}
