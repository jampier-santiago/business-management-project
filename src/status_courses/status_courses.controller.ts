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
import { StatusCoursesService } from './status_courses.service';

// DTOs
import { CreateStatusCourseDto } from './dto/create-status_course.dto';
import { UpdateStatusCourseDto } from './dto/update-status_course.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseStatusCourse } from './interfaces/statusCourses.interfaces';

@Controller('status-courses')
export class StatusCoursesController {
  constructor(private readonly statusCoursesService: StatusCoursesService) {}

  @Post()
  create(
    @Body() createStatusCourseDto: CreateStatusCourseDto,
  ): Promise<ResponseInterface<ResponseStatusCourse>> {
    return this.statusCoursesService.create(createStatusCourseDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseStatusCourse[]>> {
    return this.statusCoursesService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusCourseDto: UpdateStatusCourseDto,
  ): Promise<ResponseInterface<null>> {
    return this.statusCoursesService.update(+id, updateStatusCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<ResponseInterface<null>> {
    return this.statusCoursesService.remove(+id);
  }
}
