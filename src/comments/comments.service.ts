import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './models/comments.models';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Answer } from 'src/answers/models/answers.models';
import { CommentStatus } from 'src/enums/comment-status.enum';
import { AnswersService } from 'src/answers/answers.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
    @InjectModel(Answer.name) private AnswerModel: Model<Answer>,
    private answersService: AnswersService,
  ) {}
  async add(body: CreateCommentDto): Promise<Comment> {
    const comment = await this.CommentModel.create(body);
    await this.AnswerModel.findByIdAndUpdate(
      comment.answer,
      { $push: { comments: comment._id } },
      { new: true },
    );

    return comment;
  }
  findAll() {
    return this.CommentModel.find();
  }
  findOne(id: string) {
    //return this.CommentModel.findOne({ _id: id });
    return this.CommentModel.findById(id);
  }
  delete(id: string) {
    return this.CommentModel.findByIdAndDelete(id);
  }
  update(id: string, body: UpdateCommentDto) {
    return this.CommentModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { content: { $regex: key, $options: 'i' } } : {};
    return this.CommentModel.find(keyword);
  }

  async like(commentId: string): Promise<number> {
    const comment = await this.CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true },
    );
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment.likes;
  }

  async unlike(commentId: string): Promise<number> {
    const comment = await this.CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { likes: -1 } },
      { new: true },
    );
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment.likes;
  }

  async dislike(commentId: string): Promise<number> {
    const comment = await this.CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { dislikes: 1 } },
      { new: true },
    );
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment.dislikes;
  }

  async undislike(commentId: string): Promise<number> {
    const comment = await this.CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { dislikes: -1 } },
      { new: true },
    );
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment.dislikes;
  }

  async approveComment(commentId: string): Promise<string> {
    const comment = await this.CommentModel.findByIdAndUpdate(
      commentId,
      { $set: { status: CommentStatus.APPROVED } },
      { new: true },
    );
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    this.answersService.handleQuestionStatus(
      comment.answer,
      CommentStatus.APPROVED,
    );
    return comment.status;
  }

  async disapproveComment(commentId: string): Promise<Comment> {
    const comment = await this.CommentModel.findById(commentId);

    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    if (comment.status !== CommentStatus.APPROVED) {
      throw new BadRequestException(
        'Cannot disapprove a comment that is not approved',
      );
    }

    comment.status = CommentStatus.DISAPPROVED;
    await comment.save();
    this.answersService.handleQuestionStatus(
      comment.answer,
      CommentStatus.DISAPPROVED,
    );
    return comment;
  }
}
