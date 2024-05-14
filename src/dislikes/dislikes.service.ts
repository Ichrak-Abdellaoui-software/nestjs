import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dislike } from './models/dislikes.models';
import { DislikeDto } from './dto/dislike.dto';
import { Model } from 'mongoose';

@Injectable()
export class DislikesService {
  constructor(@InjectModel(Dislike.name) private likeModel: Model<Dislike>) {}
  async addDislike(likeDto: DislikeDto): Promise<Dislike> {
    const newDislike = new this.likeModel(likeDto);
    return newDislike.save();
  }

  async findAll(): Promise<Dislike[]> {
    return this.likeModel.find().populate('createdBy', 'fullname').exec();
  }

  async findByUser(userId: string): Promise<Dislike[]> {
    return this.likeModel.find({ createdBy: userId }).exec();
  }

  async findForContent(contentId: string): Promise<Dislike[]> {
    return this.likeModel.find({ targetId: contentId }).exec();
  }

  async numberDislikesForContent(contentId: string): Promise<number> {
    return this.likeModel.countDocuments({ targetId: contentId }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.likeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Dislike not found');
    }
  }
}
