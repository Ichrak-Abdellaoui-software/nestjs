import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MinLength } from 'class-validator';
import { Document, Types } from 'mongoose';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Question } from 'src/questions/models/questions.models';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false }) //, select: true
  @MinLength(8)
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Pole', required: true })
  pole: Types.ObjectId;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Prop()
  avatar: string;

  @Prop({ type: Number, default: 0 })
  totalLikes: number;

  @Prop({ type: Number, default: 0 })
  totalDislikes: number;

  @Prop({ type: Number, default: 0 })
  totalApproved: number;

  @Prop([{ type: Types.ObjectId, ref: Question.name }])
  questions: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
