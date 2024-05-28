import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Save } from './models/saves.models';
import { InjectModel } from '@nestjs/mongoose';
import { SaveDto } from './dto/saves.dto';

@Injectable()
export class SavesService {
  constructor(@InjectModel(Save.name) private SaveModel: Model<Save>) {}

  async add(body: SaveDto) {
    return await this.SaveModel.create(body);
  }
  delete(userId: string, questionId: string) {
    return this.SaveModel.deleteOne({ userId, questionId });
  }
  async findUserSaves(userId: string) {
    return this.SaveModel.find({ userId }).populate('questionId');
  }
}
