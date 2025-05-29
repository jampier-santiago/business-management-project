import { Test, TestingModule } from '@nestjs/testing';
import { ProjectInternsController } from './project_interns.controller';
import { ProjectInternsService } from './project_interns.service';

describe('ProjectInternsController', () => {
  let controller: ProjectInternsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectInternsController],
      providers: [ProjectInternsService],
    }).compile();

    controller = module.get<ProjectInternsController>(ProjectInternsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
