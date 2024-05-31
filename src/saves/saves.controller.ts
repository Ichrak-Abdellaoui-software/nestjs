import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { SavesService } from './saves.service';
import { SaveDto } from './dto/saves.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('saves')
export class SavesController {
  constructor(private readonly service: SavesService) {}

  @Post()
  add(@Body() body: SaveDto, @User() user: any) {
    const userId = user._id;
    return this.service.add(body, userId);
  }
  @Delete('/:saveId')
  async delete(@Param('saveId') saveId: string): Promise<{ message: string }> {
    return await this.service.delete(saveId);
  }

  @Get('/:userId')
  getUserSaves(@Param('userId') userId: string) {
    return this.service.findUserSaves(userId);
  }
}
