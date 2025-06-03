// Dependencies
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

// DTO's
import { CreateProjectInternDto } from './dto/create-project_intern.dto';

// Config
import { dataSource } from 'src/config/database.providers';

// Entities
import { ProjectIntern } from './entities/project_intern.entity';

// Services
import { ProjectsService } from 'src/projects/projects.service';
import { InternsService } from 'src/interns/interns.service';

// Interfaces
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseProjectIntern } from './interfaces/projectInterns.interfaces';

@Injectable()
export class ProjectInternsService {
  private projectInternRepository = dataSource.getRepository(ProjectIntern);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly internsService: InternsService,
  ) {}

  async assignInternToProject(
    createProjectInternDto: CreateProjectInternDto,
  ): Promise<ResponseInterface<null>> {
    const project = await this.projectsService.validateProject(
      createProjectInternDto.projectId,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const intern = await this.internsService.validateIntern(
      createProjectInternDto.internId,
    );

    if (!intern || intern.isActive === false) {
      throw new NotFoundException('Intern not found or is inactive');
    }

    const projectIntern = this.projectInternRepository.create({
      project: { id: project.id },
      intern: { id: intern.id },
      assignedDate: new Date(),
    });

    await this.projectInternRepository.save(projectIntern);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project intern assigned successfully',
    };
  }

  async findOneProject(
    id: number,
  ): Promise<ResponseInterface<ResponseProjectIntern[]>> {
    const project = await this.projectsService.validateProject(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const projectInterns = await this.projectInternRepository.find({
      where: { project: { id } },
      relations: {
        intern: true,
      },
    });

    const responseProjectIntern: ResponseProjectIntern[] = projectInterns.map(
      (projectIntern) => ({
        id: projectIntern.id,
        project: {
          id: projectIntern.project.id,
          name: projectIntern.project.name,
        },
        intern: {
          id: projectIntern.intern.id,
          name: projectIntern.intern.user.name,
          lastName: projectIntern.intern.user.lastName,
          major: {
            id: projectIntern.intern.major.id,
            name: projectIntern.intern.major.name,
          },
          semester: projectIntern.intern.semester,
        },
      }),
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data: responseProjectIntern,
    };
  }

  async finishProjectIntern(id: number): Promise<ResponseInterface<null>> {
    const projectIntern = await this.projectInternRepository.findOne({
      where: { id },
    });

    if (!projectIntern) {
      throw new NotFoundException('Project intern not found');
    }

    await this.projectInternRepository.update(id, {
      endDate: new Date(),
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project intern finished successfully',
    };
  }

  async remove(id: number): Promise<ResponseInterface<null>> {
    const projectIntern = await this.projectInternRepository.findOne({
      where: { id },
    });

    if (!projectIntern) {
      throw new NotFoundException('Project intern not found');
    }

    await this.projectInternRepository.softDelete(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project intern removed successfully',
    };
  }
}
