import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './models/answers.models';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    QuestionsModule,
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  providers: [AnswersService],
  controllers: [AnswersController],
  exports: [
    AnswersService,
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
})
export class AnswersModule {}
