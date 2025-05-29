import { Test, TestingModule } from '@nestjs/testing';
import { EntrepreneurCoursesController } from './entrepreneur_courses.controller';
import { EntrepreneurCoursesService } from './entrepreneur_courses.service';

describe('EntrepreneurCoursesController', () => {
  let controller: EntrepreneurCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntrepreneurCoursesController],
      providers: [EntrepreneurCoursesService],
    }).compile();

    controller = module.get<EntrepreneurCoursesController>(EntrepreneurCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
