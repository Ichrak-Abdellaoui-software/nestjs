import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
//import { Types } from 'mongoose';
import { NotificationType } from 'src/enums/notifications-type.enum';

export class CreateNotificationDto {
  @IsMongoId()
  creatorId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  questionId: string;

  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  targetId?: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}
