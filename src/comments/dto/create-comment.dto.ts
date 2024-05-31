import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CommentStatus } from '../../enums/comment-status.enum';

export class CreateCommentDto {
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
  answer: Types.ObjectId;

  @IsOptional()
  status: CommentStatus;
}
