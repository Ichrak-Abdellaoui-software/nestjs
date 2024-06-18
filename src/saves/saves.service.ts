import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Save } from './models/saves.models';
import { InjectModel } from '@nestjs/mongoose';
import { SaveDto } from './dto/saves.dto';

@Injectable()
export class SavesService {
  constructor(@InjectModel(Save.name) private SaveModel: Model<Save>) {}

  async add(body: SaveDto, userId: string): Promise<Save> {
    const userObjectId = new Types.ObjectId(userId);
    const questionObjectId = new Types.ObjectId(body.questionId);

    try {
      const existingSave = await this.SaveModel.findOne({
        userId: userObjectId,
        questionId: questionObjectId,
      });

      if (existingSave) {
        // Here we use HttpException to specify that this is a duplicate entry
        throw new HttpException(
          'This question has already been saved by the user.',
          HttpStatus.CONFLICT,
        );
      }

      const newSaveData = {
        ...body,
        userId: userObjectId,
        questionId: questionObjectId,
      };
      const newSave = new this.SaveModel(newSaveData);
      return newSave.save();
    } catch (error) {
      // Check if the error is already an HttpException (to avoid overriding your specific error messages)
      if (error instanceof HttpException) {
        throw error;
      }
      // Otherwise, assume an unexpected error and send a generic 500 error
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    return this.SaveModel.find({ userId: userObjectId }, 'questionId -_id')
      .populate({
        path: 'questionId',
        model: 'Question',
        populate: [
          {
            path: 'techs',
            select: 'name _id',
          },
          {
            path: 'author',
            model: 'User',
            populate: {
              path: 'pole',
              select: 'name _id',
            },
          },
          {
            path: 'answers',
            model: 'Answer',
          },
        ],
        select:
          'title author description techs status views answers createdAt updatedAt media',
      })
      .exec();
  }

  async toggleSave(body: SaveDto, userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const questionObjectId = new Types.ObjectId(body.questionId);

    try {
      const existingSave = await this.SaveModel.findOne({
        userId: userObjectId,
        questionId: questionObjectId,
      });

      if (existingSave) {
        // If it exists, remove the save (unsave)
        await this.SaveModel.deleteOne({ _id: existingSave._id });
        return { message: 'Question has been unsaved.' };
      } else {
        // If it does not exist, save the question
        const newSaveData = {
          userId: userObjectId,
          questionId: questionObjectId,
        };
        const newSave = new this.SaveModel(newSaveData);
        await newSave.save();
        return { message: 'Question has been saved.' };
      }
    } catch (error) {
      // Assuming any error not handled above is a server error
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async checkMultipleSaveStatuses(
    questionIds: string[],
    userId: string,
  ): Promise<{ [key: string]: boolean }> {
    const userObjectId = new Types.ObjectId(userId);
    const saves = await this.SaveModel.find({
      userId: userObjectId,
      questionId: { $in: questionIds.map((id) => new Types.ObjectId(id)) },
    }).exec();

    const saveStatus = {};
    saves.forEach((save) => {
      saveStatus[save.questionId.toString()] = true;
    });

    return saveStatus;
  }
}
