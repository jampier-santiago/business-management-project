// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTOs
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseCourse } from './interfaces/courses.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  private courseRepository = dataSource.getRepository(Course);

  /**
   * Creates a new course
   * @param createCourseDto - The course data to create
   * @returns A response object containing the created course information
   * @throws BadRequestException if a course with the same name already exists
   */
  async create(createCourseDto: CreateCourseDto) {
    const existingCourse = await this.courseRepository.findOne({
      where: { name: createCourseDto.name, deletedAt: IsNull() },
    });

    if (existingCourse) {
      throw new BadRequestException('Course name already exists');
    }

    const course = this.courseRepository.create({
      ...createCourseDto,
      isActive: createCourseDto.is_active ?? true,
    });

    await this.courseRepository.save(course);

    return {
      success: true,
      statusCode: 201,
      message: 'Course created successfully',
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        isActive: course.isActive,
      },
    };
  }

  /**
   * Retrieves all non-deleted courses
   * @returns A response object containing an array of all courses
   */
  async findAll(): Promise<ResponseInterface<ResponseCourse[]>> {
    const courses = await this.courseRepository.find({
      select: { deletedAt: false },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Courses fetched successfully',
      data: courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        isActive: course.isActive,
      })),
    };
  }

  /**
   * Retrieves a specific course by ID
   * @param id - The ID of the course to retrieve
   * @returns A response object containing the course information
   * @throws NotFoundException if the course is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseCourse>> {
    const course = await this.validateCourse(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Course fetched successfully',
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        isActive: course.isActive,
      },
    };
  }

  /**
   * Updates an existing course
   * @param id - The ID of the course to update
   * @param updateCourseDto - The updated course data
   * @returns A response object indicating the success of the update
   * @throws NotFoundException if the course is not found
   * @throws BadRequestException if the course name is empty or already exists
   */
  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<ResponseInterface<null>> {
    const course = await this.validateCourse(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!updateCourseDto.name || updateCourseDto.name === '') {
      throw new BadRequestException('Course name is required');
    }

    if (updateCourseDto.name === course.name) {
      throw new BadRequestException('Course name is the same');
    }

    const existingCourse = await this.courseRepository.findOne({
      where: { name: updateCourseDto.name, deletedAt: IsNull() },
    });

    if (existingCourse) {
      throw new BadRequestException('Course name already exists');
    }

    await this.courseRepository.update(id, updateCourseDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Course updated successfully',
    };
  }

  /**
   * Soft deletes a course by setting its deletedAt timestamp
   * @param id - The ID of the course to delete
   * @returns A response object indicating the success of the deletion
   * @throws NotFoundException if the course is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const course = await this.validateCourse(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.courseRepository.update(id, { deletedAt: new Date() });

    return {
      success: true,
      statusCode: 200,
      message: 'Course deleted successfully',
    };
  }

  /**
   * Retrieves all active and non-deleted courses
   * @returns A response object containing an array of active courses
   */
  async findActiveCourses(): Promise<ResponseInterface<ResponseCourse[]>> {
    const courses = await this.courseRepository.find({
      where: { isActive: true, deletedAt: IsNull() },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Active courses fetched successfully',
      data: courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        isActive: course.isActive,
      })),
    };
  }

  /**
   * Deactivates a course by setting isActive to false
   * @param id - The ID of the course to deactivate
   * @returns A response object indicating the success of the deactivation
   * @throws NotFoundException if the course is not found
   */
  async inactiveCourses(id: number): Promise<ResponseInterface<null>> {
    const course = await this.validateCourse(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.courseRepository.update(id, { isActive: false });

    return {
      success: true,
      statusCode: 200,
      message: 'Course inactive successfully',
    };
  }

  /**
   * Activates a course by setting isActive to true
   * @param id - The ID of the course to activate
   * @returns A response object indicating the success of the activation
   * @throws NotFoundException if the course is not found
   */
  async activeCourses(id: number): Promise<ResponseInterface<null>> {
    const course = await this.validateCourse(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.courseRepository.update(id, { isActive: true });

    return {
      success: true,
      statusCode: 200,
      message: 'Course active successfully',
    };
  }

  public async validateCourse(id: number): Promise<Course | null> {
    const course = await this.courseRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    return course;
  }
}
