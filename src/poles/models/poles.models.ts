import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/models/users.models';
export type PoleDocument = Pole & Document;
@Schema()
export class Pole {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  image: string;

  @Prop([{ type: Types.ObjectId, ref: User.name }])
  members: Types.ObjectId[];

  //   @Prop()
  //   teamManager:
}
export const PoleSchema = SchemaFactory.createForClass(Pole);
