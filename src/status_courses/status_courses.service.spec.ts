import { Test, TestingModule } from '@nestjs/testing';
import { StatusCoursesService } from './status_courses.service';

describe('StatusCoursesService', () => {
  let service: StatusCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusCoursesService],
    }).compile();

    service = module.get<StatusCoursesService>(StatusCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
