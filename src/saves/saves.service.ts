import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Save } from './models/saves.models';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SavesService {
  constructor(@InjectModel(Save.name) private SaveModel: Model<Save>) {}

  async add(userId: Types.ObjectId, questionId: Types.ObjectId): Promise<Save> {
    const newSave = new this.SaveModel({ user: userId, question: questionId });
    return newSave.save();
  }

  async delete(
    userId: Types.ObjectId,
    questionId: Types.ObjectId,
  ): Promise<void> {
    await this.SaveModel.deleteOne({ user: userId, question: questionId });
  }
  async findUserSaves(userId: Types.ObjectId): Promise<Save[]> {
    return this.SaveModel.find({ user: userId }).populate('question');
  }
}
