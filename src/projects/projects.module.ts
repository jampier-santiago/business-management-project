// Dependencies
import { Module } from '@nestjs/common';

// Services
import { ProjectsService } from './projects.service';

// Controllers
import { ProjectsController } from './projects.controller';

// Modules
import { EntrepreneursModule } from '../entrepreneurs/entrepreneurs.module';

@Module({
  imports: [EntrepreneursModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
