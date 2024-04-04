import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './models/answers.models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  providers: [AnswersService],
  controllers: [AnswersController],
})
export class AnswersModule {}
