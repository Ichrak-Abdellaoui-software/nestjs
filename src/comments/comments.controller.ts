import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  findAll() {
    return this.service.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
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

  @Patch('/:id/like')
  async like(@Param('id') id: string) {
    const likes = await this.service.like(id);
    return { likes };
  }

  @Patch('/:id/unlike')
  async unlike(@Param('id') id: string) {
    const likes = await this.service.unlike(id);
    return { likes };
  }

  @Patch('/:id/dislike')
  async dislike(@Param('id') id: string) {
    const dislikes = await this.service.dislike(id);
    return { dislikes };
  }

  @Patch('/:id/undislike')
  async undislike(@Param('id') id: string) {
    const dislikes = await this.service.undislike(id);
    return { dislikes };
  }

  @Patch('/:id/approve')
  async approve(@Param('id') id: string) {
    const comment = await this.service.approveComment(id);
    return { comment };
  }

  @Patch('/:id/disapprove')
  async disapprove(@Param('id') id: string) {
    const comment = await this.service.disapproveComment(id);
    return comment;
  }
}
