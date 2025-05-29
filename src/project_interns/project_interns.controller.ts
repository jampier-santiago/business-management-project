import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectInternsService } from './project_interns.service';
import { CreateProjectInternDto } from './dto/create-project_intern.dto';
import { UpdateProjectInternDto } from './dto/update-project_intern.dto';

@Controller('project-interns')
export class ProjectInternsController {
  constructor(private readonly projectInternsService: ProjectInternsService) {}

  @Post()
  create(@Body() createProjectInternDto: CreateProjectInternDto) {
    return this.projectInternsService.create(createProjectInternDto);
  }

  @Get()
  findAll() {
    return this.projectInternsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectInternsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectInternDto: UpdateProjectInternDto) {
    return this.projectInternsService.update(+id, updateProjectInternDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectInternsService.remove(+id);
  }
}
