import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SavesService } from './saves.service';
import { Types } from 'mongoose';

@Controller('saves')
export class SavesController {
  constructor(private readonly service: SavesService) {}

  @Post()
  async add(
    @Body('userId') userId: string,
    @Body('questionId') questionId: string,
  ) {
    const userIdObj = new Types.ObjectId(userId);
    const questionIdObj = new Types.ObjectId(questionId);
    return this.service.add(userIdObj, questionIdObj);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Body('userId') userId: string,
    @Body('questionId') questionId: string,
  ) {
    const userIdObj = new Types.ObjectId(userId);
    const questionIdObj = new Types.ObjectId(questionId);
    await this.service.delete(userIdObj, questionIdObj);
  }

  @Get('/:userId')
  getUserSaves(@Param('userId') userId: string) {
    const userIdObj = new Types.ObjectId(userId);
    return this.service.findUserSaves(userIdObj);
  }
}
