import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import { Question } from 'src/questions/models/questions.models';
export type TechDocument = Tech & Document;
@Schema({ collection: 'techs' })
export class Tech {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  image: string;

  @Prop([{ type: Types.ObjectId, ref: 'Question' }])
  questions: Types.ObjectId[];

  // @Prop([{ type: Types.ObjectId, ref: Question.name }])
  // questions: Types.ObjectId[];
}
export const TechSchema = SchemaFactory.createForClass(Tech);
