import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from '../../enums/notifications-type.enum';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  creatorId: Types.ObjectId; // celui qui a effectué l action

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: NotificationType;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Question' })
  questionId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId; // à qui on envoie la notif

  @Prop({ required: false, type: Types.ObjectId })
  targetId: Types.ObjectId; // ID de cible :comment/answer
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
