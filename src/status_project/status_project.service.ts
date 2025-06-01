// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// DTOs
import { CreateStatusProjectDto } from './dto/create-status_project.dto';
import { UpdateStatusProjectDto } from './dto/update-status_project.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseStatusProject } from './interfaces/statesProjects.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { StatusProject } from './entities/status_project.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class StatusProjectService {
  private statusProjectRepository = dataSource.getRepository(StatusProject);

  /**
   * Creates a new status project
   * @param createStatusProjectDto - The data transfer object containing the status project information
   * @returns A response object containing the created status project data
   */
  async create(
    createStatusProjectDto: CreateStatusProjectDto,
  ): Promise<ResponseInterface<ResponseStatusProject>> {
    const statusProject = this.statusProjectRepository.create(
      createStatusProjectDto,
    );
    await this.statusProjectRepository.save(statusProject);

    return {
      success: true,
      statusCode: 201,
      message: 'Status project created successfully',
      data: {
        id: statusProject.id,
        name: statusProject.name,
      },
    };
  }

  /**
   * Retrieves all active status projects
   * @returns A response object containing an array of status projects
   */
  async findAll(): Promise<ResponseInterface<ResponseStatusProject[]>> {
    const statusProjects = await this.statusProjectRepository.find({
      select: { deletedAt: false },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Status projects fetched successfully',
      data: statusProjects.map((statusProject) => ({
        id: statusProject.id,
        name: statusProject.name,
      })),
    };
  }

  /**
   * Retrieves a specific status project by its ID
   * @param id - The ID of the status project to retrieve
   * @returns A response object containing the requested status project
   * @throws NotFoundException if the status project is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseStatusProject>> {
    const statusProject = await this.statusProjectRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!statusProject) {
      throw new NotFoundException('Status project not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Status project fetched successfully',
      data: {
        id: statusProject.id,
        name: statusProject.name,
      },
    };
  }

  /**
   * Updates an existing status project
   * @param id - The ID of the status project to update
   * @param updateStatusProjectDto - The data transfer object containing the updated information
   * @returns A response object indicating the success of the operation
   * @throws NotFoundException if the status project is not found
   * @throws BadRequestException if the name is empty or already exists
   */
  async update(
    id: number,
    updateStatusProjectDto: UpdateStatusProjectDto,
  ): Promise<ResponseInterface<null>> {
    const statusProject = await this.statusProjectRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!statusProject) {
      throw new NotFoundException('Status project not found');
    }

    if (!updateStatusProjectDto.name || updateStatusProjectDto.name === '') {
      throw new BadRequestException('Status project name is required');
    }

    if (updateStatusProjectDto.name === statusProject.name) {
      throw new BadRequestException('Status project name is the same');
    }

    const existingStatusProject = await this.statusProjectRepository.findOne({
      where: { name: updateStatusProjectDto.name, deletedAt: IsNull() },
    });

    if (existingStatusProject) {
      throw new BadRequestException('Status project name already exists');
    }

    await this.statusProjectRepository.update(id, updateStatusProjectDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Status project updated successfully',
    };
  }

  /**
   * Soft deletes a status project by setting its deletedAt field
   * @param id - The ID of the status project to delete
   * @returns A response object indicating the success of the operation
   * @throws NotFoundException if the status project is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const statusProject = await this.statusProjectRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!statusProject) {
      throw new NotFoundException('Status project not found');
    }

    await this.statusProjectRepository.update(id, { deletedAt: new Date() });

    return {
      success: true,
      statusCode: 200,
      message: 'Status project deleted successfully',
    };
  }
}
