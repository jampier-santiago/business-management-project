import { Module } from '@nestjs/common';
import { StatusCoursesService } from './status_courses.service';
import { StatusCoursesController } from './status_courses.controller';

@Module({
  controllers: [StatusCoursesController],
  providers: [StatusCoursesService],
})
export class StatusCoursesModule {}
