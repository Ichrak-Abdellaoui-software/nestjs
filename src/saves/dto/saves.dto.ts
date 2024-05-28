import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class SaveDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  questionId: Types.ObjectId;
}
