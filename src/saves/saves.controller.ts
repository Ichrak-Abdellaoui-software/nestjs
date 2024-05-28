import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { SavesService } from './saves.service';
import { SaveDto } from './dto/saves.dto';

@Controller('saves')
export class SavesController {
  constructor(private readonly service: SavesService) {}

  @Post()
  add(@Body() body: SaveDto) {
    return this.service.add(body);
  }
  @Delete('/:userId/:questionId')
  delete(
    @Param('userId') userid: string,
    @Param('questionId') questionid: string,
  ) {
    return this.service.delete(userid, questionid);
  }

  @Get('/:userId')
  getUserSaves(@Param('userId') userId: string) {
    return this.service.findUserSaves(userId);
  }
}
