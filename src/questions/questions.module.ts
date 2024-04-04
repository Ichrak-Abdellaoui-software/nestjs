import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question, QuestionSchema } from './models/questions.models';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
