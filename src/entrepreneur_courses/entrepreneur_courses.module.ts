import { Module } from '@nestjs/common';
import { EntrepreneurCoursesService } from './entrepreneur_courses.service';
import { EntrepreneurCoursesController } from './entrepreneur_courses.controller';

@Module({
  controllers: [EntrepreneurCoursesController],
  providers: [EntrepreneurCoursesService],
})
export class EntrepreneurCoursesModule {}
