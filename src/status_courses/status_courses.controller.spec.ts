import { Test, TestingModule } from '@nestjs/testing';
import { StatusCoursesController } from './status_courses.controller';
import { StatusCoursesService } from './status_courses.service';

describe('StatusCoursesController', () => {
  let controller: StatusCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusCoursesController],
      providers: [StatusCoursesService],
    }).compile();

    controller = module.get<StatusCoursesController>(StatusCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
