/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentDto } from './dto/departments.dto';

@Controller('departments')
export class DepartmentsController {
    
  constructor(private readonly service: DepartmentsService) {}
  @Post()
  add(@Body() body : DepartmentDto) {
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
  update(@Param('id') id: string , @Body() body:DepartmentDto) {
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
