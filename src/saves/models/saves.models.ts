import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaveDocument = Save & Document;

@Schema({ timestamps: true })
export class Save {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  question: Types.ObjectId;
}

export const SaveSchema = SchemaFactory.createForClass(Save);
