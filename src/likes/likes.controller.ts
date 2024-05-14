import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikeDto } from './dto/like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async addLike(@Body() likeDto: LikeDto) {
    return this.likesService.addLike(likeDto);
  }

  @Get()
  async findAll() {
    return this.likesService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.likesService.findByUser(userId);
  }

  @Get('content/:contentId')
  async findForContent(@Param('contentId') contentId: string) {
    return this.likesService.findForContent(contentId);
  }

  @Get('content/:contentId/count')
  async numberLikesForContent(@Param('contentId') contentId: string) {
    return this.likesService.numberLikesForContent(contentId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.likesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Like not found');
      }
      throw error;
    }
  }
}
