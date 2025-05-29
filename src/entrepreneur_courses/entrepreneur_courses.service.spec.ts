import { Test, TestingModule } from '@nestjs/testing';
import { EntrepreneurCoursesService } from './entrepreneur_courses.service';

describe('EntrepreneurCoursesService', () => {
  let service: EntrepreneurCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntrepreneurCoursesService],
    }).compile();

    service = module.get<EntrepreneurCoursesService>(EntrepreneurCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
