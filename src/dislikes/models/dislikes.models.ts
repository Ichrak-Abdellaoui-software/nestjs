import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/models/users.models';

export type DislikeDocument = Dislike & Document;

@Schema({ timestamps: true })
export class Dislike {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Answer', required: false })
  answerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: false })
  commentId: Types.ObjectId;
}

export const DislikeSchema = SchemaFactory.createForClass(Dislike);
