/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './models/comments.models';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Answer } from '../answers/models/answers.models';
import { CommentStatus } from '../enums/comment-status.enum';
import { AnswersService } from '../answers/answers.service';
import { User } from '../users/models/users.models';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
    @InjectModel(Answer.name) private AnswerModel: Model<Answer>,
    @InjectModel(User.name) private UserModel: Model<User>,
    private answersService: AnswersService,
  ) {}
  async add(body: CreateCommentDto): Promise<Comment> {
    const comment = await this.CommentModel.create(body);
    await this.AnswerModel.findByIdAndUpdate(
      comment.answer,
      { $push: { comments: comment._id } },
      { new: true },
    );
    await this.UserModel.findByIdAndUpdate(
      comment.author,
      { $push: { comments: comment._id } },
      { new: true },
    );

    return comment;
  }
  findAll() {
    return this.CommentModel.find()
      .populate('author')
      .populate({ path: 'answer', model: 'Answer' })

      .exec();
  }
  findOne(id: string) {
    //return this.CommentModel.findOne({ _id: id });
    return this.CommentModel.findById(id)
      .populate('author')
      .populate({ path: 'answer', model: 'Answer' })

      .exec();
  }
  delete(id: string) {
    return this.CommentModel.findByIdAndDelete(id);
  }
  update(id: string, body: UpdateCommentDto) {
    return this.CommentModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    )
      .populate('author')
      .populate({ path: 'answer', model: 'Answer' })

      .exec();
  }
  search(key: string) {
    const keyword = key ? { content: { $regex: key, $options: 'i' } } : {};
    return this.CommentModel.find(keyword)
      .populate('author')
      .populate({ path: 'answer', model: 'Answer' })

      .exec();
  }

  // async like(commentId: string): Promise<number> {
  //   const comment = await this.CommentModel.findByIdAndUpdate(
  //     commentId,
  //     { $inc: { likes: 1 } },
  //     { new: true },
  //   );
  //   if (!comment) {
  //     throw new BadRequestException('Comment not found');
  //   }
  //   if (comment.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       comment.author,
  //       { $inc: { totalLikes: 1 } },
  //       { new: true },
  //     );
  //   }
  //   return comment.likes;
  // }

  // async unlike(commentId: string): Promise<number> {
  //   const comment = await this.CommentModel.findByIdAndUpdate(
  //     commentId,
  //     { $inc: { likes: -1 } },
  //     { new: true },
  //   );
  //   if (!comment) {
  //     throw new BadRequestException('Comment not found');
  //   }

  //   if (comment.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       comment.author,
  //       { $inc: { totalLikes: -1 } },
  //       { new: true },
  //     );
  //   }
  //   return comment.likes;
  // }

  // async dislike(commentId: string): Promise<number> {
  //   const comment = await this.CommentModel.findByIdAndUpdate(
  //     commentId,
  //     { $inc: { dislikes: 1 } },
  //     { new: true },
  //   );
  //   if (!comment) {
  //     throw new BadRequestException('Comment not found');
  //   }

  //   if (comment.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       comment.author,
  //       { $inc: { totalDislikes: 1 } },
  //       { new: true },
  //     );
  //   }
  //   return comment.dislikes;
  // }

  // async undislike(commentId: string): Promise<number> {
  //   const comment = await this.CommentModel.findByIdAndUpdate(
  //     commentId,
  //     { $inc: { dislikes: -1 } },
  //     { new: true },
  //   );
  //   if (!comment) {
  //     throw new BadRequestException('Comment not found');
  //   }
  //   if (comment.author) {
  //     await this.UserModel.findByIdAndUpdate(
  //       comment.author,
  //       { $inc: { totalDislikes: -1 } },
  //       { new: true },
  //     );
  //   }
  //   return comment.dislikes;
  // }

  // async approveComment(commentId: string): Promise<string> {
  //   const comment = await this.CommentModel.findById(commentId);
  //   if (!comment) {
  //     throw new BadRequestException('Comment not found');
  //   }
  //   if (comment.status == CommentStatus.APPROVED) {
  //     throw new BadRequestException('This comment is already approved');
  //   }
  //   comment.status = CommentStatus.APPROVED;
  //   await comment.save();
  //   this.answersService.handleQuestionStatus(
  //     comment.answer,
  //     CommentStatus.APPROVED,
  //   );
  //   await this.UserModel.findByIdAndUpdate(
  //     comment.author,
  //     { $inc: { totalApproved: 1 } },
  //     { new: true },
  //   );
  //   return comment.status; //kima t7eb chnoua traja3 status wela lcomment lkol , ba3d 9arrer
  // }

  // async disapproveComment(commentId: string): Promise<Comment> {
  //   const comment = await this.CommentModel.findById(commentId);

  //   if (!comment) {
  //     throw new BadRequestException('Comment not found');
  //   }

  //   if (comment.status !== CommentStatus.APPROVED) {
  //     throw new BadRequestException(
  //       'Cannot disapprove a comment that is not approved',
  //     );
  //   }

  //   comment.status = CommentStatus.DISAPPROVED;
  //   await comment.save();
  //   this.answersService.handleQuestionStatus(
  //     comment.answer,
  //     CommentStatus.DISAPPROVED,
  //   );
  //   await this.UserModel.findByIdAndUpdate(
  //     comment.author,
  //     { $inc: { totalApproved: -1 } },
  //     { new: true },
  //   );
  //   return comment;
  // }
}
