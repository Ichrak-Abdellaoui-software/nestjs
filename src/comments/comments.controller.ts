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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}
  @Post()
  add(@Body() body: CreateCommentDto) {
    return this.service.add(body);
  }
  @Get()
  getAll() {
    return this.service.getAll();
  }
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: UpdateCommentDto) {
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
