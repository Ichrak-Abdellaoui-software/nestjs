import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './models/users.models';
import { MongooseModule } from '@nestjs/mongoose';
import { PolesModule } from '../poles/poles.module';
import { QuestionsModule } from '../questions/questions.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
@Module({
  imports: [
    forwardRef(() => QuestionsModule),
    PolesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UsersModule {}
