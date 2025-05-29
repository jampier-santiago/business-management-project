import { Test, TestingModule } from '@nestjs/testing';
import { ProjectInternsService } from './project_interns.service';

describe('ProjectInternsService', () => {
  let service: ProjectInternsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectInternsService],
    }).compile();

    service = module.get<ProjectInternsService>(ProjectInternsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
