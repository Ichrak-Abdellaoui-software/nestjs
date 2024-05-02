import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CommentStatus } from 'src/enums/comment-status.enum';

export class CreateCommentDto {
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
  answer: Types.ObjectId;

  @IsOptional()
  status: CommentStatus;
}
