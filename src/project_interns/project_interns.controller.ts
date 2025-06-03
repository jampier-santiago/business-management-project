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

// DTO's
import { CreateProjectInternDto } from './dto/create-project_intern.dto';

// Services
import { ProjectInternsService } from './project_interns.service';

// Interfaces
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseProjectIntern } from './interfaces/projectInterns.interfaces';

@Controller('project-interns')
export class ProjectInternsController {
  constructor(private readonly projectInternsService: ProjectInternsService) {}

  @Post('assign')
  assignInternToProject(
    @Body() createProjectInternDto: CreateProjectInternDto,
  ) {
    return this.projectInternsService.assignInternToProject(
      createProjectInternDto,
    );
  }

  @Get('project/:id')
  findOneProject(
    @Param('id') id: string,
  ): Promise<ResponseInterface<ResponseProjectIntern[]>> {
    return this.projectInternsService.findOneProject(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.projectInternsService.finishProjectIntern(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.projectInternsService.remove(+id);
  }
}
