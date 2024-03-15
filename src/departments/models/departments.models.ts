import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type DepartmentDocument = Department & Document;
@Schema()
export class Department {
  @Prop({ required: true })
  name: string;
  //   @Prop()
  //   members:

  //   @Prop()
  //   teamManager:
}
export const DepartmentSchema = SchemaFactory.createForClass(Department);
