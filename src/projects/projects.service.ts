// Dependencies
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTOs
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// Config
import { dataSource } from 'src/config/database.providers';

// Interfaces
import { ResponseProject } from './interfaces/projects.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

// Entities
import { Project } from './entities/project.entity';

// Services
import { EntrepreneursService } from 'src/entrepreneurs/entrepreneurs.service';
import { StatusProjectService } from 'src/status_project/status_project.service';

@Injectable()
export class ProjectsService {
  private readonly projectRepository = dataSource.getRepository(Project);

  constructor(
    private readonly entrepreneursService: EntrepreneursService,
    private readonly statusProjectService: StatusProjectService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<ResponseInterface<null>> {
    const {
      budget,
      description,
      endDate,
      entrepreneurId,
      isActive,
      name,
      requireAccompaniment,
      startDate,
      statusProjectId,
    } = createProjectDto;

    const entrepreneur =
      await this.entrepreneursService.validateEntrepreneur(entrepreneurId);

    if (!entrepreneur) {
      throw new BadRequestException('Entrepreneur not found');
    }

    const statusProject =
      await this.statusProjectService.validateStatusProject(statusProjectId);

    if (!statusProject) {
      throw new BadRequestException('Status project not found');
    }

    const project = this.projectRepository.create({
      name,
      description,
      budget,
      startDate,
      endDate,
      entrepreneur,
      isActive,
      requiresAccompaniment: requireAccompaniment,
      statusProject: { id: statusProjectId },
    });

    await this.projectRepository.save(project);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
    };
  }

  async findAllByEntrepreneurId(
    entrepreneurId: number,
  ): Promise<ResponseInterface<ResponseProject[]>> {
    const projects = await this.projectRepository.find({
      where: { entrepreneur: { id: entrepreneurId }, deletedAt: IsNull() },
      relations: {
        entrepreneur: true,
        statusProject: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data: projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        budget: project.budget.toString(),
        startDate: project.startDate,
        endDate: project.endDate,
        isActive: project.isActive,
        requiresAccompaniment: project.requiresAccompaniment,
        entrepreneur: {
          id: project.entrepreneur.id,
          name: project.entrepreneur.name,
        },
        status: {
          id: project.statusProject.id,
          name: project.statusProject.name,
        },
      })),
    };
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.validateProject(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (updateProjectDto.name) {
      if (updateProjectDto.name === '') {
        throw new BadRequestException('Project name is required');
      }

      if (project.name === updateProjectDto.name) {
        throw new BadRequestException('Project name is same as before');
      }

      const existingProject = await this.projectRepository.findOne({
        where: { name: updateProjectDto.name, deletedAt: IsNull() },
      });

      if (existingProject) {
        throw new BadRequestException('Project name is already in use');
      }
    }

    if (updateProjectDto.statusProjectId) {
      const statusProject =
        await this.statusProjectService.validateStatusProject(
          updateProjectDto.statusProjectId,
        );

      if (!statusProject) {
        throw new BadRequestException('Status project not found');
      }
    }

    if (updateProjectDto.entrepreneurId) {
      const entrepreneur = await this.entrepreneursService.validateEntrepreneur(
        updateProjectDto.entrepreneurId,
      );

      if (!entrepreneur) {
        throw new BadRequestException('Entrepreneur not found');
      }
    }

    await this.projectRepository.update(id, {
      name: updateProjectDto.name ?? project.name,
      description: updateProjectDto.description ?? project.description,
      budget: updateProjectDto.budget ?? project.budget,
      startDate: updateProjectDto.startDate ?? project.startDate,
      endDate: updateProjectDto.endDate ?? project.endDate,
      entrepreneur: {
        id: updateProjectDto.entrepreneurId ?? project.entrepreneur.id,
      },
      statusProject: {
        id: updateProjectDto.statusProjectId ?? project.statusProject.id,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
    };
  }

  async inactiveProject(id: number): Promise<ResponseInterface<null>> {
    const project = await this.validateProject(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    await this.projectRepository.update(id, { isActive: false });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project inactive successfully',
    };
  }

  async activeProject(id: number): Promise<ResponseInterface<null>> {
    const project = await this.validateProject(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    await this.projectRepository.update(id, { isActive: true });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project active successfully',
    };
  }

  async remove(id: number): Promise<ResponseInterface<null>> {
    const project = await this.validateProject(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    await this.projectRepository.update(id, { deletedAt: new Date() });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project removed successfully',
    };
  }

  async validateProject(id: number): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        entrepreneur: true,
        statusProject: true,
      },
    });

    return project;
  }

  async completeProject(id: number): Promise<ResponseInterface<null>> {
    const project = await this.validateProject(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    await this.projectRepository.softDelete(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project completed successfully',
    };
  }
}
