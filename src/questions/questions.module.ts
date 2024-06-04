import { Module, forwardRef } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question, QuestionSchema } from './models/questions.models';
import { MongooseModule } from '@nestjs/mongoose';
import { TechsModule } from '../techs/techs.module';
import { UsersModule } from '../users/users.module';
import { TechSchema } from '../techs/models/techs.models';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    TechsModule,
    MongooseModule.forFeature([{ name: 'Tech', schema: TechSchema }]),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
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
  providers: [QuestionsService, JwtGuard, JwtStrategy],
  controllers: [QuestionsController],
  exports: [
    QuestionsService,
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
})
export class QuestionsModule {}
