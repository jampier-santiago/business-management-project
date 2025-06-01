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
import { StatusProjectService } from './status_project.service';

// DTOs
import { CreateStatusProjectDto } from './dto/create-status_project.dto';
import { UpdateStatusProjectDto } from './dto/update-status_project.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseStatusProject } from './interfaces/statesProjects.interfaces';

@Controller('status-project')
export class StatusProjectController {
  constructor(private readonly statusProjectService: StatusProjectService) {}

  @Post()
  create(
    @Body() createStatusProjectDto: CreateStatusProjectDto,
  ): Promise<ResponseInterface<ResponseStatusProject>> {
    return this.statusProjectService.create(createStatusProjectDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseStatusProject[]>> {
    return this.statusProjectService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<ResponseInterface<ResponseStatusProject>> {
    return this.statusProjectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateStatusProjectDto: UpdateStatusProjectDto,
  ): Promise<ResponseInterface<null>> {
    return this.statusProjectService.update(+id, updateStatusProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<ResponseInterface<null>> {
    return this.statusProjectService.remove(+id);
  }
}
