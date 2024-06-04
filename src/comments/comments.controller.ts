import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/decorators/user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'file', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  add(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
      video?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
    @Body() body: CreateCommentDto,
    @User() user: any,
  ) {
    const userId = user._id;
    const allFiles = Object.values(files).flat();
    //console.log(allFiles);
    return this.service.add(body, userId, allFiles);
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
  //   const comment = await this.service.approveComment(id);
  //   return { comment };
  // }

  // @Patch('/:id/disapprove')
  // async disapprove(@Param('id') id: string) {
  //   const comment = await this.service.disapproveComment(id);
  //   return comment;
  // }
}
