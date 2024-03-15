import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type TechDocument = Tech & Document;
@Schema()
export class Tech {
  @Prop({ required: true })
  name: string;
}
export const TechSchema = SchemaFactory.createForClass(Tech);
