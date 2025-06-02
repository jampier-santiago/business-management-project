// Dependencies
import { Module } from '@nestjs/common';

// Services
import { StatusCoursesService } from './status_courses.service';

// Controllers
import { StatusCoursesController } from './status_courses.controller';

@Module({
  controllers: [StatusCoursesController],
  providers: [StatusCoursesService],
  exports: [StatusCoursesService],
})
export class StatusCoursesModule {}
