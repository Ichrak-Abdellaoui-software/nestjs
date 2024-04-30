import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  creator: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  questionId: string;

  @IsMongoId()
  userId: string;
}
