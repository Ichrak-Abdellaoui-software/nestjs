import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Save } from './models/saves.models';
import { InjectModel } from '@nestjs/mongoose';
import { SaveDto } from './dto/saves.dto';

@Injectable()
export class SavesService {
  constructor(@InjectModel(Save.name) private SaveModel: Model<Save>) {}

  async add(body: SaveDto, userId: string): Promise<Save> {
    const userObjectId = new Types.ObjectId(userId);
    const newSaveData = {
      ...body,
      userId: userObjectId,
    };
    const newSave = new this.SaveModel(newSaveData);
    return newSave.save();
  }
  async delete(saveId: string): Promise<{ message: string }> {
    const deletionResult = await this.SaveModel.deleteOne({
      _id: saveId,
    }).exec();

    if (deletionResult.deletedCount === 0) {
      throw new NotFoundException(`${saveId} not found.`);
    }

    return { message: `${saveId} deleted successfully.` };
  }
  async findUserSaves(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    return this.SaveModel.find({ userId: userObjectId })
      .populate('questionId')
      .exec();
  }
}
