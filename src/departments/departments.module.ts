import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department, DepartmentSchema } from './models/departments.models';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
