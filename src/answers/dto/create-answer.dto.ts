import { IsNotEmpty, IsOptional, IsMongoId, Min } from 'class-validator';
import { Types } from 'mongoose';
import { AnswerStatus } from 'src/enums/answer-status.enum';

export class CreateAnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  author: Types.ObjectId;

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

  @Min(0)
  @IsOptional()
  upvotes: number;

  @Min(0)
  @IsOptional()
  downvotes: number;

  @IsOptional()
  status: AnswerStatus;
}
