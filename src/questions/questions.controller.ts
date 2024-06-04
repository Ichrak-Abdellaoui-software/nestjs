/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './models/questions.models';
import { User } from '../decorators/user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}
  @Post('/add')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 5 },
        { name: 'file', maxCount: 2 },
        { name: 'video', maxCount: 1 },
        { name: 'audio', maxCount: 2 },
      ],
      { limits: { files: 7 } },
    ),
  )
  add(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
      video?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
    @Body() body: CreateQuestionDto,
    @User() user: any,
  ) {
    const allFiles = Object.values(files).flat();
    //console.log(allFiles);

    const userId = user._id;

    // console.log(
    //   'add post:: ',
    //   body,
    //   'userId',
    //   userId,
    //   'role',
    //   user.role,
    //   user.email,
    // );

    //console.log(body.techs);

    return this.service.add(body, userId, allFiles);
  }
  @Get() // par plus récente
  findAll() {
    return this.service.findAll();
  }
  @Get('/old') // par plus ancienne
  findAllByNewest() {
    return this.service.findAllByOld();
  }
  @Get('/mostseen') // most seen
  findAllByViews() {
    return this.service.findAllByViews();
  }
  @Get('/date/:date') // date/2024-05-10   "YYYY-MM-DD"
  async findQuestionsByDate(@Param('date') date: string): Promise<Question[]> {
    const formattedDate = new Date(date);
    const questions = await this.service.findQuestionsByDate(formattedDate);

    if (questions.length === 0) {
      throw new NotFoundException('No questions found for this date!');
    }
    return questions;
  }
  @Get('/mine')
  findByUser(@User() user: any) {
    return this.service.findByUser(user._id);
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: UpdateQuestionDto) {
    return this.service.update(id, body);
  }
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
  @Post('/search')
  search(@Query('key') key) {
    return this.service.search(key);
  }
}
