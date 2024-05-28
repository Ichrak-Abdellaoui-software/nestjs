import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './models/comments.models';
import { AnswersModule } from '../answers/answers.module';
import { AnswersService } from '../answers/answers.service';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    AnswersModule,
    QuestionsModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  providers: [CommentsService, AnswersService],
  controllers: [CommentsController],
  exports: [
    CommentsService,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
})
export class CommentsModule {}
