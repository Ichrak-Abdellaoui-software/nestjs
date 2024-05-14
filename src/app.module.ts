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
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SavesModule } from './saves/saves.module';
import { LikesModule } from './likes/likes.module';
import { DislikesModule } from './dislikes/dislikes.module';

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
    ProfileModule,
    NotificationsModule,
    SavesModule,
    LikesModule,
    DislikesModule,
  ],
})
export class AppModule {}
