import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './models/likes.models';
import { Model } from 'mongoose';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<Like>) {}
  async add(likeDto: LikeDto): Promise<Like> {
    const newLike = new this.likeModel(likeDto);
    return newLike.save();
  }

  async findAll(): Promise<Like[]> {
    return this.likeModel.find().populate('createdBy', 'fullname').exec();
  }

  async findByUser(userId: string): Promise<Like[]> {
    return this.likeModel
      .find({ createdBy: userId })
      .find({ createdBy: userId })
      .populate({ path: 'answerId', model: 'Answer' })
      .populate({ path: 'commentId', model: 'Comment' })
      .exec();
  }

  async findForContent(contentId: string): Promise<Like[]> {
    return this.likeModel.find({ targetId: contentId }).exec();
  }

  async numberLikesForContent(contentId: string): Promise<number> {
    return this.likeModel.countDocuments({ targetId: contentId }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.likeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Like not found');
    }
  }
}
