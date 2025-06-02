// Dependencies
import { Module } from '@nestjs/common';

// Services
import { StatusProjectService } from './status_project.service';

// Controllers
import { StatusProjectController } from './status_project.controller';

@Module({
  controllers: [StatusProjectController],
  providers: [StatusProjectService],
  exports: [StatusProjectService],
})
export class StatusProjectModule {}
