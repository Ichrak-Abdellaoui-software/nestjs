import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApprovalDocument = Approval & Document;

@Schema({ timestamps: true })
export class Approval {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Answer', required: false })
  answerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: false })
  commentId: Types.ObjectId;
}

export const ApprovalSchema = SchemaFactory.createForClass(Approval);
