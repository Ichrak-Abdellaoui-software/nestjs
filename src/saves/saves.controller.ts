import { Controller, Post, Delete, Get, Param, Body, Query } from '@nestjs/common';
import { SavesService } from './saves.service';
import { SaveDto } from './dto/saves.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('saves')
export class SavesController {
  constructor(private readonly service: SavesService) {}

  @Post()
  add(@Body() body: SaveDto, @User() user: any) {
    try {
      const userId = user._id;
      return this.service.add(body, userId);
    } catch (error) {
      // If the service throws an HttpException, it will be handled by the global exception filter
      // Custom error handling can be added here if needed
      throw error;
    }
  }
  @Delete('/:saveId')
  async delete(@Param('saveId') saveId: string): Promise<{ message: string }> {
    return await this.service.delete(saveId);
  }

  @Get('/')
  getUserSaves(@User() user: any) {
    const userId = user._id;
    return this.service.findUserSaves(userId);
  }

  @Post('toggle')
  async toggle(@Body() body: SaveDto, @User() user: any) {
    const userId = user._id;
    const result = await this.service.toggleSave(body, userId);
    return result;
  }
  @Get('statuses')
  async getMultipleSaveStatuses(
    @Query('questionIds') questionIds: string[],
    @User() user: any,
  ) {
    const userId = user._id;
    return this.service.checkMultipleSaveStatuses(questionIds, userId);
  }
}
