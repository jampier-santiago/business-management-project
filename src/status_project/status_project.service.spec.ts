import { Test, TestingModule } from '@nestjs/testing';
import { StatusProjectService } from './status_project.service';

describe('StatusProjectService', () => {
  let service: StatusProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusProjectService],
    }).compile();

    service = module.get<StatusProjectService>(StatusProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
