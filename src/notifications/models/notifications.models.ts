import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  creatorId: Types.ObjectId; // celui qui a effectué l action

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Question' })
  questionId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId; // a qui on envoie la notif
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
