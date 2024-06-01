import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dislike } from './models/dislikes.models';
import { Model } from 'mongoose';
import { DislikeDto } from './dto/dislike.dto';

@Injectable()
export class DislikesService {
  constructor(
    @InjectModel(Dislike.name) private dislikeModel: Model<Dislike>,
  ) {}
  async add(dislikeDto: DislikeDto, userId: string): Promise<Dislike> {
    const newDislikeData = {
      ...dislikeDto,
      createdBy: userId,
    };
    const newDislike = new this.dislikeModel(newDislikeData);
    return newDislike.save();
  }

  async findAll(): Promise<Dislike[]> {
    return this.dislikeModel.find().populate('createdBy', 'fullname').exec();
  }

  async findByUser(userId: string): Promise<Dislike[]> {
    return this.dislikeModel
      .find({ createdBy: userId })
      .find({ createdBy: userId })
      .populate({ path: 'answerId', model: 'Answer' })
      .populate({ path: 'commentId', model: 'Comment' })
      .exec();
  }

  async findForContent(contentId: string): Promise<Dislike[]> {
    return this.dislikeModel.find({ targetId: contentId }).exec();
  }

  async numberDislikesForContent(contentId: string): Promise<number> {
    return this.dislikeModel.countDocuments({ targetId: contentId }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.dislikeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Dislike not found');
    }
  }
}
