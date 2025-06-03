// Dependencies
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTOs
import { CreateInternDto } from './dto/create-intern.dto';
import { UpdateInternDto } from './dto/update-intern.dto';

// Config
import { dataSource } from 'src/config/database.providers';

// Entities
import { Intern } from './entities/intern.entity';

// Interfaces
import type { ResponseInterface } from '../shared/interfaces/response.interfaces';
import type { ResponseIntern } from './interfaces/interns.interfaces';

// Services
import { MajorsService } from 'src/majors/majors.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InternsService {
  // Repositories
  private interRepository = dataSource.getRepository(Intern);

  constructor(
    private readonly usersService: UsersService,
    private readonly majorsService: MajorsService,
  ) {}

  /**
   * Creates a new intern record
   * @param createInternDto - Data transfer object containing intern creation information
   * @returns Promise with the created intern information
   * @throws NotFoundException if the major is not found
   * @throws BadRequestException if the user creation fails
   */
  async create(
    createInternDto: CreateInternDto,
  ): Promise<ResponseInterface<ResponseIntern>> {
    const major = await this.majorsService.existMajor(createInternDto.majorId);

    if (!major) {
      throw new NotFoundException('Major not found');
    }

    const user = await this.usersService.create({
      birthDate: createInternDto.birthDate,
      documentNumber: createInternDto.documentNumber,
      email: createInternDto.email,
      genderId: createInternDto.genderId,
      lastName: createInternDto.lastName,
      name: createInternDto.name,
      password: createInternDto.password,
      phoneNumber: createInternDto.phoneNumber,
      roleId: createInternDto.roleId,
      typeDocument: createInternDto.typeDocument,
    });

    if (!user.data) {
      throw new BadRequestException('User not created');
    }

    const intern = await this.interRepository.save({
      semester: createInternDto.semester,
      isActive: createInternDto.isActive,
      startDate: createInternDto.startDate,
      major: { id: createInternDto.majorId },
      user: { id: user.data.id },
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Intern created successfully',
      data: {
        id: intern.id,
        semester: intern.semester,
        is_active: intern.isActive,
        start_date: intern.startDate,
        end_date: intern.endDate,
        major: {
          id: major.id,
          name: major.name,
        },
        user: {
          id: user.data.id,
          name: user.data.name,
          lastName: user.data.lastName,
        },
      },
    };
  }

  /**
   * Retrieves all active interns
   * @returns Promise with an array of all active interns
   */
  async findAll(): Promise<ResponseInterface<ResponseIntern[]>> {
    const interns = await this.interRepository.find({
      where: { deletedAt: IsNull() },
      relations: {
        user: true,
        major: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interns fetched successfully',
      data: interns.map((data) => ({
        id: data.id,
        semester: data.semester,
        is_active: data.isActive,
        start_date: data.startDate,
        end_date: data.endDate,
        major: {
          id: data.major.id,
          name: data.major.name,
        },
        user: {
          id: data.user.id,
          name: data.user.name,
          lastName: data.user.lastName,
        },
      })),
    };
  }

  /**
   * Retrieves a specific intern by ID
   * @param id - The ID of the intern to retrieve
   * @returns Promise with the intern information
   * @throws NotFoundException if the intern is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseIntern>> {
    const intern = await this.interRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        user: true,
        major: true,
      },
    });

    if (!intern) {
      throw new NotFoundException('Intern not found');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Intern fetched successfully',
      data: {
        id: intern.id,
        end_date: intern.endDate,
        is_active: intern.isActive,
        semester: intern.semester,
        start_date: intern.startDate,
        user: {
          id: intern.user.id,
          name: intern.user.name,
          lastName: intern.user.lastName,
        },
        major: {
          id: intern.major.id,
          name: intern.major.name,
        },
      },
    };
  }

  /**
   * Updates an existing intern record
   * @param id - The ID of the intern to update
   * @param updateInternDto - Data transfer object containing update information
   * @returns Promise with update confirmation
   * @throws NotFoundException if the intern is not found
   */
  async update(
    id: number,
    updateInternDto: UpdateInternDto,
  ): Promise<ResponseInterface<null>> {
    const intern = await this.interRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!intern) {
      throw new NotFoundException('Intern not found');
    }

    if (updateInternDto.majorId) {
      const major = await this.majorsService.existMajor(
        updateInternDto.majorId,
      );

      if (!major) {
        throw new NotFoundException('Major not found');
      }
    }

    if (updateInternDto.userId) {
      const user = await this.usersService.validateUser(updateInternDto.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    await this.interRepository.update(id, {
      ...updateInternDto,
      user: {
        id: updateInternDto.userId ? updateInternDto.userId : intern.user.id,
      },
      major: {
        id: updateInternDto.majorId ? updateInternDto.majorId : intern.major.id,
      },
    });

    return {
      success: true,
      message: 'Intern updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Soft deletes an intern record
   * @param id - The ID of the intern to remove
   * @returns Promise with deletion confirmation
   * @throws NotFoundException if the intern is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const intern = await this.interRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        user: true,
        major: true,
      },
    });

    if (!intern) {
      throw new NotFoundException('Intern not found');
    }

    await this.interRepository.softDelete(id);

    return {
      success: true,
      message: 'Intern deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Marks an intern as inactive and sets their end date
   * @param id - The ID of the intern to deactivate
   * @returns Promise with deactivation confirmation
   * @throws NotFoundException if the intern is not found
   */
  async inactiveIntern(id: number): Promise<ResponseInterface<null>> {
    const intern = await this.interRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        user: true,
        major: true,
      },
    });

    if (!intern) {
      throw new NotFoundException('Intern not found');
    }

    await this.interRepository.update(id, {
      isActive: false,
      endDate: new Date(),
    });

    return {
      success: true,
      message: 'Intern inactive successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
