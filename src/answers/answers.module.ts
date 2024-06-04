import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './models/answers.models';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    UsersModule,
    QuestionsModule,
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './uploads/medias',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  ],
  providers: [AnswersService],
  controllers: [AnswersController],
  exports: [
    AnswersService,
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
})
export class AnswersModule {}
