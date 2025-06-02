// Dependencies
import { Module } from '@nestjs/common';

// Services
import { ProjectsService } from './projects.service';

// Controllers
import { ProjectsController } from './projects.controller';

// Modules
import { EntrepreneursModule } from '../entrepreneurs/entrepreneurs.module';
import { StatusProjectModule } from 'src/status_project/status_project.module';

@Module({
  imports: [EntrepreneursModule, StatusProjectModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
