import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './models/answers.models';
import { Model, Types } from 'mongoose';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Question } from 'src/questions/models/questions.models';
import { AnswerStatus } from 'src/enums/answer-status.enum';
import { QuestionStatus } from 'src/enums/question-status.enum';
import { CommentStatus } from 'src/enums/comment-status.enum';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name) private AnswerModel: Model<Answer>,
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
  ) {}
  async add(body: CreateAnswerDto): Promise<Answer> {
    const answer = await this.AnswerModel.create(body);
    await this.QuestionModel.findByIdAndUpdate(
      answer.question,
      { $push: { answers: answer._id } },
      { new: true },
    );

    return answer;
  }
  findAll() {
    return this.AnswerModel.find();
  }
  findOne(id: string) {
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
    const keyword = key ? { content: { $regex: key, $options: 'i' } } : {};
    return this.AnswerModel.find(keyword);
  }
  async like(answerId: string): Promise<number> {
    const answer = await this.AnswerModel.findByIdAndUpdate(
      answerId,
      { $inc: { likes: 1 } },
      { new: true },
    );
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }
    return answer.likes;
  }

  async unlike(answerId: string): Promise<number> {
    const answer = await this.AnswerModel.findByIdAndUpdate(
      answerId,
      { $inc: { likes: -1 } },
      { new: true },
    );
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }
    return answer.likes;
  }

  async dislike(answerId: string): Promise<number> {
    const answer = await this.AnswerModel.findByIdAndUpdate(
      answerId,
      { $inc: { dislikes: 1 } },
      { new: true },
    );
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }
    return answer.dislikes;
  }

  async undislike(answerId: string): Promise<number> {
    const answer = await this.AnswerModel.findByIdAndUpdate(
      answerId,
      { $inc: { dislikes: -1 } },
      { new: true },
    );
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }
    return answer.dislikes;
  }

  async approveAnswer(answerId: string): Promise<Answer> {
    const answer = await this.AnswerModel.findByIdAndUpdate(
      answerId,
      { $set: { status: AnswerStatus.APPROVED } },
      { new: true },
    );
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }
    await this.QuestionModel.findByIdAndUpdate(
      answer.question,
      { $set: { status: QuestionStatus.CLOSED } },
      { new: true },
    );
    return answer;
  }

  async disapproveAnswer(answerId: string): Promise<Answer> {
    const answer = await this.AnswerModel.findById(answerId);
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }
    if (answer.status !== AnswerStatus.APPROVED) {
      throw new BadRequestException(
        'Cannot disapprove an answer that is not approved',
      );
    }
    answer.status = AnswerStatus.DISAPPROVED;
    await answer.save();
    await this.QuestionModel.findByIdAndUpdate(
      answer.question,
      { $set: { status: QuestionStatus.OPEN } },
      { new: true },
    );
    return answer;
  }
  async handleQuestionStatus(
    answerId: Types.ObjectId,
    status: CommentStatus,
  ): Promise<void> {
    const answer = await this.AnswerModel.findById(answerId).select('question');
    if (!answer) {
      throw new BadRequestException('Answer not found');
    }

    const newQuestionStatus =
      status === CommentStatus.APPROVED
        ? QuestionStatus.CLOSED
        : QuestionStatus.OPEN;

    await this.QuestionModel.findByIdAndUpdate(
      answer.question,
      { $set: { status: newQuestionStatus } },
      { new: true },
    );
  }
}
