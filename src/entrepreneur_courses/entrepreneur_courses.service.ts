// Dependencies
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

// DTOs
import { CreateEntrepreneurCourseDto } from './dto/create-entrepreneur_course.dto';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { EntrepreneurCourse } from './entities/entrepreneur_course.entity';
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseEntrepreneurCourse } from './interfaces/entrepreneurCourses.interfaces';

// Services
import { CoursesService } from 'src/courses/courses.service';
import { EntrepreneursService } from 'src/entrepreneurs/entrepreneurs.service';
import { StatusCoursesService } from 'src/status_courses/status_courses.service';
import { IsNull } from 'typeorm';

@Injectable()
export class EntrepreneurCoursesService {
  private entrepreneurCourseRepository =
    dataSource.getRepository(EntrepreneurCourse);

  constructor(
    private readonly entrepreneursService: EntrepreneursService,
    private readonly coursesService: CoursesService,
    private readonly statusCoursesService: StatusCoursesService,
  ) {}

  /**
   * Creates a new entrepreneur course assignment
   * @param createEntrepreneurCourseDto - DTO containing entrepreneurId, courseId, and statusId
   * @returns Promise with response containing success status and message
   * @throws BadRequestException if entrepreneur, course, or status is not found
   */
  public async create(
    createEntrepreneurCourseDto: CreateEntrepreneurCourseDto,
  ): Promise<ResponseInterface<ResponseEntrepreneurCourse>> {
    const { entrepreneurId, courseId, statusId } = createEntrepreneurCourseDto;

    const entrepreneur =
      await this.entrepreneursService.validateEntrepreneur(entrepreneurId);

    if (!entrepreneur) {
      throw new BadRequestException('Entrepreneur not found');
    }

    const course = await this.coursesService.validateCourse(courseId);

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const status =
      await this.statusCoursesService.validateStatusCourse(statusId);

    if (!status) {
      throw new BadRequestException('Status not found');
    }

    const entrepreneurCourse = this.entrepreneurCourseRepository.create({
      course: { id: courseId },
      entrepreneur: { id: entrepreneurId },
      statusCourse: { id: statusId },
      assignedAt: new Date(),
    });

    await this.entrepreneurCourseRepository.save(entrepreneurCourse);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Entrepreneur course created successfully',
    };
  }

  /**
   * Retrieves all courses assigned to a specific entrepreneur
   * @param entrepreneurId - ID of the entrepreneur
   * @returns Promise with response containing array of entrepreneur courses
   */
  public async findAllByEntrepreneurId(
    entrepreneurId: number,
  ): Promise<ResponseInterface<ResponseEntrepreneurCourse[]>> {
    const entrepreneurCourses = await this.entrepreneurCourseRepository.find({
      where: { entrepreneur: { id: entrepreneurId }, deletedAt: IsNull() },
      relations: {
        entrepreneur: true,
        course: true,
        statusCourse: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur courses found successfully',
      data: entrepreneurCourses.map((entrepreneurCourse) => ({
        id: entrepreneurCourse.id,
        assignedAt: entrepreneurCourse.assignedAt,
        completedAt: entrepreneurCourse.completedAt,
        entrepreneur: {
          id: entrepreneurCourse.entrepreneur.id,
          name: entrepreneurCourse.entrepreneur.name,
        },
        course: {
          id: entrepreneurCourse.course.id,
          name: entrepreneurCourse.course.name,
        },
        status: entrepreneurCourse.statusCourse.name,
      })),
    };
  }

  /**
   * Marks a specific entrepreneur course as completed
   * @param id - ID of the entrepreneur course to complete
   * @returns Promise with response containing success status and message
   * @throws BadRequestException if entrepreneur course is not found
   */
  public async completeCourse(id: number): Promise<ResponseInterface<null>> {
    const entrepreneurCourse = await this.validateEntrepreneurCourse(id);

    if (!entrepreneurCourse) {
      throw new BadRequestException('Entrepreneur course not found');
    }

    await this.entrepreneurCourseRepository.update(id, {
      completedAt: new Date(),
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur course updated successfully',
    };
  }

  /**
   * Soft deletes an entrepreneur course by setting its deletedAt timestamp
   * @param id - ID of the entrepreneur course to remove
   * @returns Promise with response containing success status and message
   * @throws BadRequestException if entrepreneur course is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const entrepreneurCourse = await this.validateEntrepreneurCourse(id);

    if (!entrepreneurCourse) {
      throw new BadRequestException('Entrepreneur course not found');
    }

    await this.entrepreneurCourseRepository.update(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur course deleted successfully',
    };
  }

  /**
   * Validates if an entrepreneur course exists and is not deleted
   * @param id - ID of the entrepreneur course to validate
   * @returns Promise with the entrepreneur course entity if found, null otherwise
   */
  public async validateEntrepreneurCourse(
    id: number,
  ): Promise<EntrepreneurCourse | null> {
    const entrepreneurCourse = await this.entrepreneurCourseRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    return entrepreneurCourse;
  }
}
