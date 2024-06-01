/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TechsService } from './techs.service';
import { TechDto } from './dto/techs.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Controller('techs')
export class TechsController {
  constructor(private readonly service: TechsService) {}
  @Post()
  add(@Body() body : TechDto) {
    return this.service.add(body);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Get('/:id/questions')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string , @Body() body:UpdateTechDto) {
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
