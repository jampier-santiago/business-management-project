import { Injectable } from '@nestjs/common';
import { CreateEntrepreneurCourseDto } from './dto/create-entrepreneur_course.dto';
import { UpdateEntrepreneurCourseDto } from './dto/update-entrepreneur_course.dto';

@Injectable()
export class EntrepreneurCoursesService {
  create(createEntrepreneurCourseDto: CreateEntrepreneurCourseDto) {
    return 'This action adds a new entrepreneurCourse';
  }

  findAll() {
    return `This action returns all entrepreneurCourses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entrepreneurCourse`;
  }

  update(id: number, updateEntrepreneurCourseDto: UpdateEntrepreneurCourseDto) {
    return `This action updates a #${id} entrepreneurCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} entrepreneurCourse`;
  }
}
