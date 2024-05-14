import { Module } from '@nestjs/common';
import { DislikesController } from './dislikes.controller';
import { DislikesService } from './dislikes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DislikeSchema } from './models/dislikes.models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dislike', schema: DislikeSchema }]),
  ],
  controllers: [DislikesController],
  providers: [DislikesService],
})
export class DislikesModule {}
