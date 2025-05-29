import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntrepreneurCoursesService } from './entrepreneur_courses.service';
import { CreateEntrepreneurCourseDto } from './dto/create-entrepreneur_course.dto';
import { UpdateEntrepreneurCourseDto } from './dto/update-entrepreneur_course.dto';

@Controller('entrepreneur-courses')
export class EntrepreneurCoursesController {
  constructor(private readonly entrepreneurCoursesService: EntrepreneurCoursesService) {}

  @Post()
  create(@Body() createEntrepreneurCourseDto: CreateEntrepreneurCourseDto) {
    return this.entrepreneurCoursesService.create(createEntrepreneurCourseDto);
  }

  @Get()
  findAll() {
    return this.entrepreneurCoursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entrepreneurCoursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntrepreneurCourseDto: UpdateEntrepreneurCourseDto) {
    return this.entrepreneurCoursesService.update(+id, updateEntrepreneurCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entrepreneurCoursesService.remove(+id);
  }
}
