import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { DislikesService } from './dislikes.service';
import { DislikeDto } from './dto/dislike.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('likes')
export class DislikesController {
  constructor(private readonly dislikesService: DislikesService) {}

  @Post()
  async addDislike(@Body() dislikeDto: DislikeDto, @User() user: any) {
    const userId = user._id;
    return this.dislikesService.add(dislikeDto, userId);
  }

  @Get()
  async findAll() {
    return this.dislikesService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.dislikesService.findByUser(userId);
  }
  @Get('user/:userId/count')
  async numberlikesByUser(@Param('userId') userId: string) {
    return (await this.dislikesService.findByUser(userId)).length;
  }

  @Get('content/:contentId')
  async findForContent(@Param('contentId') contentId: string) {
    return this.dislikesService.findForContent(contentId);
  }

  @Get('content/:contentId/count')
  async numberDislikesForContent(@Param('contentId') contentId: string) {
    return this.dislikesService.numberDislikesForContent(contentId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.dislikesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Dislike not found');
      }
      throw error;
    }
  }
}
