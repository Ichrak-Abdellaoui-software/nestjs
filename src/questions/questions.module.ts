import { Module, forwardRef } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question, QuestionSchema } from './models/questions.models';
import { MongooseModule } from '@nestjs/mongoose';
import { TechsModule } from 'src/techs/techs.module';
import { UsersModule } from 'src/users/users.module';
import { TechSchema } from 'src/techs/models/techs.models';

@Module({
  imports: [
    TechsModule,
    MongooseModule.forFeature([{ name: 'Tech', schema: TechSchema }]),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [
    QuestionsService,
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
})
export class QuestionsModule {}
