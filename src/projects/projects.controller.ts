// Dependencies
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

// Services
import { ProjectsService } from './projects.service';

// DTOs
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// Interfaces
import { ResponseProject } from './interfaces/projects.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ResponseInterface<null>> {
    return this.projectsService.create(createProjectDto);
  }

  @Get('entrepreneur/:entrepreneurId')
  findAllByEntrepreneurId(
    @Param('entrepreneurId') entrepreneurId: string,
  ): Promise<ResponseInterface<ResponseProject[]>> {
    return this.projectsService.findAllByEntrepreneurId(+entrepreneurId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Patch(':id/inactive')
  inactiveProject(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.projectsService.inactiveProject(+id);
  }

  @Patch(':id/active')
  activeProject(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.projectsService.activeProject(+id);
  }

  @Patch(':id/complete')
  completeProject(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.projectsService.completeProject(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
