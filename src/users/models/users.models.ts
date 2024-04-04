import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Question } from 'src/questions/models/questions.models';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true }) //, select: false
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Pole', required: true })
  pole: Types.ObjectId;

  @Prop({ required: true, enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Prop()
  avatar: string;

  @Prop([{ type: Types.ObjectId, ref: Question.name }])
  questions: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
