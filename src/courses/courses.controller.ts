// Dependencies
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

// Services
import { CoursesService } from './courses.service';

// DTOs
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseCourse } from './interfaces/courses.interfaces';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseCourse[]>> {
    return this.coursesService.findAll();
  }

  @Get('active')
  findActiveCourses(): Promise<ResponseInterface<ResponseCourse[]>> {
    return this.coursesService.findActiveCourses();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ResponseInterface<ResponseCourse>> {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<ResponseInterface<null>> {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<ResponseInterface<null>> {
    return this.coursesService.remove(+id);
  }

  @Patch(':id/inactive')
  inactiveCourses(@Param('id') id: number): Promise<ResponseInterface<null>> {
    return this.coursesService.inactiveCourses(+id);
  }

  @Patch(':id/active')
  activeCourses(@Param('id') id: number): Promise<ResponseInterface<null>> {
    return this.coursesService.activeCourses(+id);
  }
}
