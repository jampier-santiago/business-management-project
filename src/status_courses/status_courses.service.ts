// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// DTOs
import { CreateStatusCourseDto } from './dto/create-status_course.dto';
import { UpdateStatusCourseDto } from './dto/update-status_course.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseStatusCourse } from './interfaces/statusCourses.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { StatusCourse } from './entities/status_course.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class StatusCoursesService {
  private statusCourseRepository = dataSource.getRepository(StatusCourse);

  /**
   * Creates a new course status
   * @param createStatusCourseDto - DTO containing the data to create the course status
   * @returns Promise with the response including the created course status data
   * @throws BadRequestException if a course status with the same name already exists
   */
  async create(
    createStatusCourseDto: CreateStatusCourseDto,
  ): Promise<ResponseInterface<ResponseStatusCourse>> {
    const existingStatusCourse = await this.statusCourseRepository.findOne({
      where: { name: createStatusCourseDto.name, deletedAt: IsNull() },
    });

    if (existingStatusCourse) {
      throw new BadRequestException('Status course name already exists');
    }

    const statusCourse = this.statusCourseRepository.create(
      createStatusCourseDto,
    );

    await this.statusCourseRepository.save(statusCourse);

    return {
      success: true,
      statusCode: 201,
      message: 'Status course created successfully',
      data: {
        id: statusCourse.id,
        name: statusCourse.name,
      },
    };
  }

  /**
   * Retrieves all active course statuses
   * @returns Promise with the response including an array of course statuses
   */
  async findAll(): Promise<ResponseInterface<ResponseStatusCourse[]>> {
    const statusCourses = await this.statusCourseRepository.find({
      select: { deletedAt: false },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Status courses fetched successfully',
      data: statusCourses.map((statusCourse) => ({
        id: statusCourse.id,
        name: statusCourse.name,
      })),
    };
  }

  /**
   * Updates an existing course status
   * @param id - ID of the course status to update
   * @param updateStatusCourseDto - DTO containing the data to update the course status
   * @returns Promise with the operation response
   * @throws NotFoundException if the course status is not found
   * @throws BadRequestException if the name is empty, unchanged, or already exists
   */
  async update(
    id: number,
    updateStatusCourseDto: UpdateStatusCourseDto,
  ): Promise<ResponseInterface<null>> {
    const statusCourse = await this.statusCourseRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!statusCourse) {
      throw new NotFoundException('Status course not found');
    }

    if (!updateStatusCourseDto.name || updateStatusCourseDto.name === '') {
      throw new BadRequestException('Status course name is required');
    }

    if (updateStatusCourseDto.name === statusCourse.name) {
      throw new BadRequestException('Status course name is the same');
    }

    const existingStatusCourse = await this.statusCourseRepository.findOne({
      where: { name: updateStatusCourseDto.name, deletedAt: IsNull() },
    });

    if (existingStatusCourse) {
      throw new BadRequestException('Status course name already exists');
    }

    await this.statusCourseRepository.update(id, updateStatusCourseDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Status course updated successfully',
    };
  }

  /**
   * Logically deletes a course status (soft delete)
   * @param id - ID of the course status to delete
   * @returns Promise with the operation response
   * @throws NotFoundException if the course status is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const statusCourse = await this.statusCourseRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!statusCourse) {
      throw new NotFoundException('Status course not found');
    }

    await this.statusCourseRepository.softDelete(id);

    return {
      success: true,
      statusCode: 200,
      message: 'Status course deleted successfully',
    };
  }

  public async validateStatusCourse(id: number): Promise<StatusCourse | null> {
    const statusCourse = await this.statusCourseRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    return statusCourse;
  }
}
