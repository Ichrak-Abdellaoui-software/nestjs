import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './models/users.models';
import { MongooseModule } from '@nestjs/mongoose';
import { PolesModule } from '../poles/poles.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    forwardRef(() => QuestionsModule),
    PolesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UsersModule {}
