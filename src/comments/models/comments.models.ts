import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CommentStatus } from '../../enums/comment-status.enum';
export type CommentDocument = Comment & Document;
@Schema({ timestamps: true })
export class Comment {
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

  @Prop({ type: Types.ObjectId, ref: 'Answer', required: true })
  answer: Types.ObjectId;

  // @Prop({ type: Number, default: 0 })
  // likes: number;

  // @Prop({ type: Number, default: 0 })
  // dislikes: number;

  @Prop({ enum: CommentStatus, default: CommentStatus.PENDING })
  status: CommentStatus;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
