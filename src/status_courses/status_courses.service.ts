import { Injectable } from '@nestjs/common';
import { CreateStatusCourseDto } from './dto/create-status_course.dto';
import { UpdateStatusCourseDto } from './dto/update-status_course.dto';

@Injectable()
export class StatusCoursesService {
  create(createStatusCourseDto: CreateStatusCourseDto) {
    return 'This action adds a new statusCourse';
  }

  findAll() {
    return `This action returns all statusCourses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statusCourse`;
  }

  update(id: number, updateStatusCourseDto: UpdateStatusCourseDto) {
    return `This action updates a #${id} statusCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusCourse`;
  }
}
