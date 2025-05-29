import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusCoursesService } from './status_courses.service';
import { CreateStatusCourseDto } from './dto/create-status_course.dto';
import { UpdateStatusCourseDto } from './dto/update-status_course.dto';

@Controller('status-courses')
export class StatusCoursesController {
  constructor(private readonly statusCoursesService: StatusCoursesService) {}

  @Post()
  create(@Body() createStatusCourseDto: CreateStatusCourseDto) {
    return this.statusCoursesService.create(createStatusCourseDto);
  }

  @Get()
  findAll() {
    return this.statusCoursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusCoursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusCourseDto: UpdateStatusCourseDto) {
    return this.statusCoursesService.update(+id, updateStatusCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusCoursesService.remove(+id);
  }
}
