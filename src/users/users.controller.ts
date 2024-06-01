import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/users.models';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Post()
  add(@Body() body: CreateUserDto) {
    return this.service.add(body);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }
  ///////////////////////////////////////////////////////////////////////////////
  @Get('/posting/:period')
  async getTopUsers(@Param('period') period: string): Promise<User[]> {
    try {
      const validPeriods = ['week', 'month', 'year'];
      if (!validPeriods.includes(period)) {
        throw new HttpException(
          'Invalid period. Please use week, month, or year.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.service.findMostPosting(period);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.update(id, body);
  }

  @Put('/:id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('avatar') imageUrl: string,
  ) {
    return this.service.updateAvatar(id, file, imageUrl);
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
