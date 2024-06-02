import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MinLength } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Answer } from '../../answers/models/answers.models';
import { Comment } from '../../comments/models/comments.models';
import { UserRoles } from '../../enums/user-roles.enum';
import { Question } from '../../questions/models/questions.models';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, select: false }) //This ensures that the field is not included in the result when fetching documents
  @MinLength(8)
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Pole', required: true })
  pole: Types.ObjectId;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Prop()
  avatar: string;

  // @Prop({ type: Number, default: 0 })
  // totalApproved: number;
  @Prop({ type: String, select: false }) // pas selected by default
  resetToken: string;

  @Prop([{ type: Types.ObjectId, ref: Question.name }])
  questions: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: Answer.name }])
  answers: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: Comment.name }])
  comments: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
