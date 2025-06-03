// Dependencies
import { Module } from '@nestjs/common';

// Services
import { ProjectInternsService } from './project_interns.service';

// Controllers
import { ProjectInternsController } from './project_interns.controller';

// Modules
import { ProjectsModule } from 'src/projects/projects.module';
import { InternsModule } from 'src/interns/interns.module';

@Module({
  imports: [ProjectsModule, InternsModule],
  controllers: [ProjectInternsController],
  providers: [ProjectInternsService],
})
export class ProjectInternsModule {}
