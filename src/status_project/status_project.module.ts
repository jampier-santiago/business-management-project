import { Module } from '@nestjs/common';
import { StatusProjectService } from './status_project.service';
import { StatusProjectController } from './status_project.controller';

@Module({
  controllers: [StatusProjectController],
  providers: [StatusProjectService],
})
export class StatusProjectModule {}
