import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './models/comments.models';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
  ) {}
  add(body: CreateCommentDto) {
    return this.CommentModel.create(body);
  }
  getAll() {
    return this.CommentModel.find();
  }
  getOne(id: string) {
    //return this.CommentModel.findOne({ _id: id });
    return this.CommentModel.findById(id);
  }
  delete(id: string) {
    return this.CommentModel.findByIdAndDelete({ _id: id });
  }
  update(id: string, body: UpdateCommentDto) {
    return this.CommentModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.CommentModel.find(keyword);
  }
}
