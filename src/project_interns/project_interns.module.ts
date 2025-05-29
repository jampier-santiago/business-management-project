import { Module } from '@nestjs/common';
import { ProjectInternsService } from './project_interns.service';
import { ProjectInternsController } from './project_interns.controller';

@Module({
  controllers: [ProjectInternsController],
  providers: [ProjectInternsService],
})
export class ProjectInternsModule {}
