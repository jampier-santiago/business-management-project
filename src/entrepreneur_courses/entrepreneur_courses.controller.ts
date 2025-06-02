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
import { EntrepreneurCoursesService } from './entrepreneur_courses.service';

// DTOs
import { CreateEntrepreneurCourseDto } from './dto/create-entrepreneur_course.dto';

// Interfaces
import { ResponseEntrepreneurCourse } from './interfaces/entrepreneurCourses.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

@Controller('entrepreneur-courses')
export class EntrepreneurCoursesController {
  constructor(
    private readonly entrepreneurCoursesService: EntrepreneurCoursesService,
  ) {}

  @Post()
  create(
    @Body() createEntrepreneurCourseDto: CreateEntrepreneurCourseDto,
  ): Promise<ResponseInterface<ResponseEntrepreneurCourse>> {
    return this.entrepreneurCoursesService.create(createEntrepreneurCourseDto);
  }

  @Get('entrepreneur/:entrepreneurId')
  findAllByEntrepreneurId(
    @Param('entrepreneurId') entrepreneurId: string,
  ): Promise<ResponseInterface<ResponseEntrepreneurCourse[]>> {
    return this.entrepreneurCoursesService.findAllByEntrepreneurId(
      +entrepreneurId,
    );
  }

  @Patch(':id/complete')
  completeCourse(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.entrepreneurCoursesService.completeCourse(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.entrepreneurCoursesService.remove(+id);
  }
}
