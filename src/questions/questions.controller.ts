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

@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}
  @Post()
  add(@Body() body: CreateQuestionDto) {
    return this.service.add(body);
  }
  @Get() // par plus ancienne
  findAll() {
    return this.service.findAll();
  }
  @Get('/newest') // par plus récente
  findAllByNewest() {
    return this.service.findAllByNewest();
  }
  @Get('/by-view') // most seen
  findAllByViews() {
    return this.service.findAllByViews();
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

  @Get('/:id/views')
  async incrementViews(@Param('id') id: string) {
    try {
      const updatedQuestion = await this.service.incrementViews(id);
      return updatedQuestion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to increment views due to an unexpected error');
    }
  }
}
