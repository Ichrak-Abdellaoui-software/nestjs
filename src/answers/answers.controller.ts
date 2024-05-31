import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('answers')
export class AnswersController {
  constructor(private readonly service: AnswersService) {}
  @Post()
  async add(@Body() body: CreateAnswerDto, @User() user: any) {
    const userId = user._id;
    return this.service.add(body, userId);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: UpdateAnswerDto) {
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

  // @Patch('/:id/like')
  // async like(@Param('id') id: string) {
  //   const likes = await this.service.like(id);
  //   return { likes };
  // }

  // @Patch('/:id/unlike')
  // async unlike(@Param('id') id: string) {
  //   const likes = await this.service.unlike(id);
  //   return { likes };
  // }

  // @Patch('/:id/dislike')
  // async dislike(@Param('id') id: string) {
  //   const dislikes = await this.service.dislike(id);
  //   return { dislikes };
  // }

  // @Patch('/:id/undislike')
  // async undislike(@Param('id') id: string) {
  //   const dislikes = await this.service.undislike(id);
  //   return { dislikes };
  // }

  // @Patch('/:id/approve')
  // async approve(@Param('id') id: string) {
  //   const answer = await this.service.approveAnswer(id);
  //   return answer;
  // }

  // @Patch('/:id/disapprove')
  // async disapprove(@Param('id') id: string) {
  //   const answer = await this.service.disapproveAnswer(id);
  //   return answer;
  // }
}
