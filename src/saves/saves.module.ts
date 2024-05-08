import { Module } from '@nestjs/common';
import { SavesController } from './saves.controller';
import { SavesService } from './saves.service';
import { Save, SaveSchema } from './models/saves.models';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Save.name, schema: SaveSchema }]),
  ],
  controllers: [SavesController],
  providers: [SavesService],
  exports: [
    MongooseModule.forFeature([{ name: Save.name, schema: SaveSchema }]),
  ],
})
export class SavesModule {}
