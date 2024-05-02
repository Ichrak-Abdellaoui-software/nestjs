/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PolesService } from './poles.service';
import { PoleDto } from './dto/poles.dto';
import { UpdatePoleDto } from './dto/uodate-pole.dto';

@Controller('poles')
export class PolesController {
    
  constructor(private readonly service: PolesService) {}
  @Post()
  add(@Body() body : PoleDto) {
    return this.service.add(body);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string , @Body() body:UpdatePoleDto) {
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
