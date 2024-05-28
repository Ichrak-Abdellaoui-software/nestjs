import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Approval, ApprovalDocument } from './models/approvals.models';
import { ApprovalDto } from './dto/approval.dto';
import { Answer, AnswerDocument } from '../answers/models/answers.models';
import {
  Question,
  QuestionDocument,
} from '../questions/models/questions.models';
import { Comment, CommentDocument } from '../comments/models/comments.models';
import { Types } from 'mongoose';
const { ObjectId } = Types;

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectModel(Approval.name)
    private readonly approvalModel: Model<ApprovalDocument>,
    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async changeApprovalStatus(
    approvalDto: ApprovalDto,
    status: 'APPROVED' | 'DISAPPROVED',
  ): Promise<Approval> {
    const { commentId, answerId, questionId } = approvalDto;

    const filter = {
      questionId,
      $or: [{ commentId }, { answerId }],
    };

    const update = {
      status,
      commentId,
      answerId,
      questionId,
    };

    const approval = await this.approvalModel
      .findOneAndUpdate(filter, update, { new: true, upsert: true })
      .exec();

    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    if (commentId) {
      await this.commentModel.updateOne({ _id: commentId }, { status }).exec();
    }

    if (answerId) {
      await this.answerModel.updateOne({ _id: answerId }, { status }).exec();
    }

    await this.questionModel
      .updateOne(
        { _id: questionId },
        { status: status === 'APPROVED' ? 'CLOSED' : 'OPEN' },
      )
      .exec();

    return this.approvalModel.findById(approval._id).exec();
  }

  async approve(approvalDto: ApprovalDto): Promise<Approval> {
    return this.changeApprovalStatus(approvalDto, 'APPROVED');
  }

  async disapprove(approvalDto: ApprovalDto): Promise<string> {
    const { commentId, answerId, questionId } = approvalDto;
    const filter = { questionId, $or: [{ commentId }, { answerId }] };

    const approval = await this.approvalModel.findOne(filter).exec();
    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    await this.approvalModel.deleteOne({ _id: approval._id }).exec();

    if (commentId) {
      await this.commentModel
        .updateOne({ _id: commentId }, { status: 'DISAPPROVED' })
        .exec();
      return `The commentId ${commentId} is disapproved, question ${questionId} is reopened.`;
    } else if (answerId) {
      await this.answerModel
        .updateOne({ _id: answerId }, { status: 'DISAPPROVED' })
        .exec();
      return `The answerId ${answerId} is disapproved, question ${questionId} is reopened.`;
    }

    await this.questionModel
      .updateOne({ _id: questionId }, { status: 'OPEN' })
      .exec();
    return `The question ${questionId} is reopened.`;
  }

  async findAll(): Promise<Approval[]> {
    return this.approvalModel
      .find()
      .populate('answerId', 'author')
      .populate('commentId', 'author')
      .exec();
  }

  async findByUsetypescr(userId: string): Promise<Approval[]> {
    const objectId = new ObjectId(userId);
    const results = await this.approvalModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: 'commentId',
            foreignField: '_id',
            as: 'commentDetails',
          },
        },
        {
          $lookup: {
            from: 'answers',
            localField: 'answerId',
            foreignField: '_id',
            as: 'answerDetails',
          },
        },
        {
          $unwind: {
            path: '$commentDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: { path: '$answerDetails', preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            $or: [
              {
                'commentDetails.author': objectId,
                'commentDetails.status': 'APPROVED',
              },
              {
                'answerDetails.author': objectId,
                'answerDetails.status': 'APPROVED',
              },
            ],
          },
        },
      ])
      .exec();

    console.log('Results found:', results);
    if (results.length === 0) {
      throw new NotFoundException(
        `Approvals not found for user with ID ${userId}`,
      );
    }
    return results;
  }
}
