// Dependencies
import { Module } from '@nestjs/common';

// Services
import { EntrepreneurCoursesService } from './entrepreneur_courses.service';

// Controllers
import { EntrepreneurCoursesController } from './entrepreneur_courses.controller';

// Modules
import { CoursesModule } from '../courses/courses.module';
import { EntrepreneursModule } from '../entrepreneurs/entrepreneurs.module';
import { StatusCoursesModule } from '../status_courses/status_courses.module';

@Module({
  imports: [CoursesModule, StatusCoursesModule, EntrepreneursModule],
  controllers: [EntrepreneurCoursesController],
  providers: [EntrepreneurCoursesService],
  exports: [EntrepreneurCoursesService],
})
export class EntrepreneurCoursesModule {}
