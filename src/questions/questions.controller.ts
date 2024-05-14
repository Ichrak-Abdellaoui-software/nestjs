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
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './models/questions.models';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}
  @Post()
  add(@Body() body: CreateQuestionDto) {
    return this.service.add(body);
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
