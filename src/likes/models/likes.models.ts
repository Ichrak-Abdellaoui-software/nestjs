import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/models/users.models';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, refPath: 'contentType' })
  targetId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['Answer', 'Comment'] })
  contentType: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
