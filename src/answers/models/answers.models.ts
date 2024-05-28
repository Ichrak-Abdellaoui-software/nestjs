import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AnswerStatus } from '../../enums/answer-status.enum';

export type AnswerDocument = Answer & Document;
@Schema({ timestamps: true })
export class Answer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop(
    raw({
      image: { type: String, required: false },
      file: { type: String, required: false },
      video: { type: String, required: false },
      audio: { type: String, required: false },
    }),
  )
  media: {
    image?: string;
    file?: string;
    video?: string;
    audio?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  question: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  comments: Types.ObjectId[];

  @Prop({ enum: AnswerStatus, default: AnswerStatus.PENDING })
  status: AnswerStatus;
}
export const AnswerSchema = SchemaFactory.createForClass(Answer);
