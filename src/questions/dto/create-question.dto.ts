import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsMongoId({ each: true })
  techs: Types.ObjectId[];

  @IsOptional()
  media?: {
    image?: string;
    file?: string;
    video?: string;
    audio?: string;
  };
}
