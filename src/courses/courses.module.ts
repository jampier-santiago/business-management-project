// Dependencies
import { Module } from '@nestjs/common';

// Services
import { CoursesService } from './courses.service';

// Controllers
import { CoursesController } from './courses.controller';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
