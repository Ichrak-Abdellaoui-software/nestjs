/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './models/answers.models';
import { Model, Types } from 'mongoose';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Question } from '../questions/models/questions.models';
import { AnswerStatus } from '../enums/answer-status.enum';
import { QuestionStatus } from '../enums/question-status.enum';
import { CommentStatus } from '../enums/comment-status.enum';
import { User } from '../users/models/users.models';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name) private AnswerModel: Model<Answer>,
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}
  async add(body: CreateAnswerDto): Promise<Answer> {
    const answer = await this.AnswerModel.create(body);
    await this.QuestionModel.findByIdAndUpdate(
      answer.question,
      { $push: { answers: answer._id } },
      { new: true },
    );
    await this.UserModel.findByIdAndUpdate(
      answer.author,
      { $push: { answers: answer._id } },
      { new: true },
    );

    return answer;
  }
  findAll() {
    return this.AnswerModel.find()
      .populate('author')
      .populate({ path: 'question', model: 'Question' })
      .populate({ path: 'comments', model: 'Comment' })
      .exec();
  }
  findOne(id: string) {
    //return this.AnswerModel.findOne({ _id: id });
    return this.AnswerModel.findById(id)
      .populate('author')
      .populate({ path: 'question', model: 'Question' })
      .populate({ path: 'comments', model: 'Comment' })
      .exec();
  }
  delete(id: string) {
    return this.AnswerModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: UpdateAnswerDto) {
    return this.AnswerModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    )
      .populate('author')
      .populate({ path: 'question', model: 'Question' })
      .populate({ path: 'comments', model: 'Comment' })
      .exec();
  }
  search(key: string) {
    const keyword = key ? { content: { $regex: key, $options: 'i' } } : {};
    return this.AnswerModel.find(keyword)
      .populate('author')
      .populate({ path: 'question', model: 'Question' })
      .populate({ path: 'comments', model: 'Comment' })
      .exec();
  }
  // async like(answerId: string): Promise<number> {
  //   const answer = await this.AnswerModel.findByIdAndUpdate(
  //     answerId,
  //     { $inc: { likes: 1 } },
  //     { new: true },
  //   );
  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }
  //   //incremnte totallikes
  //   if (answer.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       answer.author,
  //       { $inc: { totalLikes: 1 } },
  //       { new: true },
  //     );
  //   }
  //   return answer.likes;
  // }

  // async unlike(answerId: string): Promise<number> {
  //   const answer = await this.AnswerModel.findByIdAndUpdate(
  //     answerId,
  //     { $inc: { likes: -1 } },
  //     { new: true },
  //   );
  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }
  //   if (answer.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       answer.author,
  //       { $inc: { totalLikes: -1 } },
  //       { new: true },
  //     );
  //   }
  //   return answer.likes;
  // }

  // async dislike(answerId: string): Promise<number> {
  //   const answer = await this.AnswerModel.findByIdAndUpdate(
  //     answerId,
  //     { $inc: { dislikes: 1 } },
  //     { new: true },
  //   );
  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }
  //   if (answer.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       answer.author,
  //       { $inc: { totalDislikes: 1 } },
  //       { new: true },
  //     );
  //   }
  //   return answer.dislikes;
  // }

  // async undislike(answerId: string): Promise<number> {
  //   const answer = await this.AnswerModel.findByIdAndUpdate(
  //     answerId,
  //     { $inc: { dislikes: -1 } },
  //     { new: true },
  //   );
  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }
  //   if (answer.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       answer.author,
  //       { $inc: { totalDislikes: -1 } },
  //       { new: true },
  //     );
  //   }
  //   return answer.dislikes;
  // }

  // async approveAnswer(answerId: string): Promise<Answer> {
  //   const answer = await this.AnswerModel.findById(answerId);

  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }
  //   if (answer.status === AnswerStatus.APPROVED) {
  //     throw new BadRequestException('This answer is already approved');
  //   }
  //   answer.status = AnswerStatus.APPROVED;
  //   await answer.save();

  //   if (answer.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       answer.author,
  //       { $inc: { totalApproved: 1 } },
  //       { new: true },
  //     );
  //   }
  //   await this.QuestionModel.findByIdAndUpdate(
  //     answer.question,
  //     { $set: { status: QuestionStatus.CLOSED } },
  //     { new: true },
  //   );
  //   return answer;
  // }

  // async disapproveAnswer(answerId: string): Promise<Answer> {
  //   const answer = await this.AnswerModel.findById(answerId);
  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }
  //   if (answer.status !== AnswerStatus.APPROVED) {
  //     throw new BadRequestException(
  //       'Cannot disapprove an answer that is not approved',
  //     );
  //   }
  //   answer.status = AnswerStatus.DISAPPROVED;
  //   await answer.save();
  //   if (answer.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       answer.author,
  //       { $inc: { totalApproved: -1 } },
  //       { new: true },
  //     );
  //   }
  //   await this.QuestionModel.findByIdAndUpdate(
  //     answer.question,
  //     { $set: { status: QuestionStatus.OPEN } },
  //     { new: true },
  //   );
  //   return answer;
  // }
  // async handleQuestionStatus(
  //   answerId: Types.ObjectId,
  //   status: CommentStatus,
  // ): Promise<void> {
  //   const answer = await this.AnswerModel.findById(answerId).select('question');
  //   if (!answer) {
  //     throw new BadRequestException('Answer not found');
  //   }

  //   const newQuestionStatus =
  //     status === CommentStatus.APPROVED
  //       ? QuestionStatus.CLOSED
  //       : QuestionStatus.OPEN;

  //   await this.QuestionModel.findByIdAndUpdate(
  //     answer.question,
  //     { $set: { status: newQuestionStatus } },
  //     { new: true },
  //   );
  // }
}
