// Dependencies
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTO's
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

// Config
import { dataSource } from 'src/config/database.providers';

// Entities
import { Instructor } from './entities/instructor.entity';

// Interfaces
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseInstructor } from './interfaces/instructors.interfaces';

// Services
import { UsersService } from 'src/users/users.service';
import { MajorsService } from 'src/majors/majors.service';

@Injectable()
export class InstructorService {
  private instructorRepository = dataSource.getRepository(Instructor);

  constructor(
    private readonly usersService: UsersService,
    private readonly majorsService: MajorsService,
  ) {}

  async create(
    createInstructorDto: CreateInstructorDto,
  ): Promise<ResponseInterface<null>> {
    const user = await this.usersService.validateUser(
      createInstructorDto.userId,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const major = await this.majorsService.existMajor(
      createInstructorDto.majorId,
    );

    if (!major) {
      throw new NotFoundException('Major not found');
    }

    const instructor = this.instructorRepository.create({
      user: { id: user.id },
      major: { id: major.id },
    });

    await this.instructorRepository.save(instructor);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Instructor created successfully',
    };
  }

  async findAll(): Promise<ResponseInterface<ResponseInstructor[]>> {
    const instructors = await this.instructorRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      relations: {
        major: true,
        user: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Instructors fetched successfully',
      data: instructors.map((instructor) => ({
        major: {
          id: instructor.major.id,
          name: instructor.major.name,
        },
        user: {
          id: instructor.user.id,
          name: instructor.user.name,
          lastName: instructor.user.lastName,
        },
      })),
    };
  }

  async findOne(id: number): Promise<ResponseInterface<ResponseInstructor>> {
    const instructor = await this.instructorRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        major: true,
        user: true,
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Instructor fetched successfully',
      data: {
        major: {
          id: instructor.major.id,
          name: instructor.major.name,
        },
        user: {
          id: instructor.user.id,
          name: instructor.user.name,
          lastName: instructor.user.lastName,
        },
      },
    };
  }

  async update(
    id: number,
    updateInstructorDto: UpdateInstructorDto,
  ): Promise<ResponseInterface<null>> {
    const instructor = await this.instructorRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    await this.instructorRepository.update(id, {
      major: { id: updateInstructorDto.majorId },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Instructor updated successfully',
    };
  }

  async remove(id: number): Promise<ResponseInterface<null>> {
    const instructor = await this.instructorRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    await this.instructorRepository.softDelete(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Instructor deleted successfully',
    };
  }
}
