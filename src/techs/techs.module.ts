import { Module } from '@nestjs/common';
import { TechsService } from './techs.service';
import { TechsController } from './techs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tech, TechSchema } from './models/techs.models';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tech', schema: TechSchema }])],
  providers: [TechsService],
  controllers: [TechsController],
  exports: [
    MongooseModule.forFeature([{ name: Tech.name, schema: TechSchema }]),
  ],
})
export class TechsModule {}
