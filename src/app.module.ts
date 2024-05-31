import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { CommentsModule } from './comments/comments.module';
import { PolesModule } from './poles/poles.module';
import { TechsModule } from './techs/techs.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from './notifications/notifications.module';
import { SavesModule } from './saves/saves.module';
import { LikesModule } from './likes/likes.module';
import { DislikesModule } from './dislikes/dislikes.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    QuestionsModule,
    AnswersModule,
    CommentsModule,
    PolesModule,
    TechsModule,
    NotificationsModule,
    SavesModule,
    LikesModule,
    DislikesModule,
    ApprovalsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
