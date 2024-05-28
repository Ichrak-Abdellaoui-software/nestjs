import { Module } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { Approval, ApprovalSchema } from './models/approvals.models';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from '../comments/comments.module';
import { AnswersModule } from '../answers/answers.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    CommentsModule,
    AnswersModule,
    QuestionsModule,
    MongooseModule.forFeature([
      { name: Approval.name, schema: ApprovalSchema },
    ]),
  ],
  providers: [ApprovalsService],
  controllers: [ApprovalsController],
})
export class ApprovalsModule {}
