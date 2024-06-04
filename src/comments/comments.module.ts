import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './models/comments.models';
import { AnswersModule } from '../answers/answers.module';
import { AnswersService } from '../answers/answers.service';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    UsersModule,
    AnswersModule,
    QuestionsModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
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
  providers: [CommentsService, AnswersService],
  controllers: [CommentsController],
  exports: [
    CommentsService,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
})
export class CommentsModule {}
