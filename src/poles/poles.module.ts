import { Module } from '@nestjs/common';
import { PolesService } from './poles.service';
import { PolesController } from './poles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pole, PoleSchema } from './models/poles.models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pole.name, schema: PoleSchema }]),
  ],
  providers: [PolesService],
  controllers: [PolesController],
})
export class PolesModule {}
