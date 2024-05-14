import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Answer } from 'src/answers/models/answers.models';
import { QuestionStatus } from 'src/enums/question-status.enum';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop([{ type: Types.ObjectId, ref: 'Tech', required: true }])
  techs: Types.ObjectId[];

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

  @Prop({ enum: QuestionStatus, default: QuestionStatus.OPEN })
  status: QuestionStatus;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop([{ type: Types.ObjectId, ref: Answer.name }])
  answers: Types.ObjectId[];
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
