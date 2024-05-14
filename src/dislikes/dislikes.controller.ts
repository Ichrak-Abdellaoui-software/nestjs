import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DislikeDto } from './dto/dislike.dto';
import { DislikesService } from './dislikes.service';

@Controller('dislikes')
export class DislikesController {
  constructor(private readonly likesService: DislikesService) {}

  @Post()
  async addDislike(@Body() likeDto: DislikeDto) {
    return this.likesService.addDislike(likeDto);
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
  async numberDislikesForContent(@Param('contentId') contentId: string) {
    return this.likesService.numberDislikesForContent(contentId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.likesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Dislike not found');
      }
      throw error;
    }
  }
}
