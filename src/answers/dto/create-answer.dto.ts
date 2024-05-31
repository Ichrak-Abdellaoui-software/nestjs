import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { AnswerStatus } from '../../enums/answer-status.enum';

export class CreateAnswerDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  media: {
    image?: string;
    file?: string;
    video?: string;
    audio?: string;
  };

  @IsMongoId()
  @IsNotEmpty()
  question: Types.ObjectId;

  @IsMongoId({ each: true })
  @IsOptional()
  comments: Types.ObjectId[];

  @IsOptional()
  status: AnswerStatus;
}
