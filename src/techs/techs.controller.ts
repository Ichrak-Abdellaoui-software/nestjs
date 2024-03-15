/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TechsService } from './techs.service';
import { TechDto } from './dto/techs.dto';

@Controller('techs')
export class TechsController {
  constructor(private readonly service: TechsService) {}
  @Post()
  add(@Body() body : TechDto) {
    return this.service.add(body);
  }
  @Get()
  getAll() {
    return this.service.getAll();
  }
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string , @Body() body:TechDto) {
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
}
