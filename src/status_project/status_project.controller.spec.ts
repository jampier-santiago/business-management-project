import { Test, TestingModule } from '@nestjs/testing';
import { StatusProjectController } from './status_project.controller';
import { StatusProjectService } from './status_project.service';

describe('StatusProjectController', () => {
  let controller: StatusProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusProjectController],
      providers: [StatusProjectService],
    }).compile();

    controller = module.get<StatusProjectController>(StatusProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
