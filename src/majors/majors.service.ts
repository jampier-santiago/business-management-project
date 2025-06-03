// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTOs
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

// Interfaces
import { ResponseMajor } from './interfaces/majors.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Major } from './entities/major.entity';

@Injectable()
export class MajorsService {
  private majorRepository = dataSource.getRepository(Major);

  /**
   * Creates a new major in the system
   * @param createMajorDto - The data transfer object containing the major information
   * @returns A response interface indicating the success of the operation
   * @throws BadRequestException if a major with the same name already exists
   */
  async create(
    createMajorDto: CreateMajorDto,
  ): Promise<ResponseInterface<null>> {
    const major = await this.majorRepository.findOne({
      where: { name: createMajorDto.name, deletedAt: IsNull() },
    });

    if (major) {
      throw new BadRequestException('Major already exists');
    }

    const newMajor = this.majorRepository.create(createMajorDto);

    await this.majorRepository.save(newMajor);

    return {
      success: true,
      statusCode: 201,
      message: 'Major created successfully',
    };
  }

  /**
   * Retrieves all active majors from the system
   * @returns A response interface containing an array of majors
   */
  async findAll(): Promise<ResponseInterface<ResponseMajor[]>> {
    const majors = await this.majorRepository.find({
      where: { deletedAt: IsNull() },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Majors fetched successfully',
      data: majors.map((major) => ({
        id: major.id,
        name: major.name,
      })),
    };
  }

  /**
   * Retrieves a specific major by its ID
   * @param id - The ID of the major to retrieve
   * @returns A response interface containing the major information
   * @throws NotFoundException if the major is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseMajor>> {
    const major = await this.existMajor(id);

    if (!major) {
      throw new NotFoundException('Major not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Major fetched successfully',
      data: {
        id: major.id,
        name: major.name,
      },
    };
  }

  /**
   * Updates an existing major's information
   * @param id - The ID of the major to update
   * @param updateMajorDto - The data transfer object containing the updated information
   * @returns A response interface indicating the success of the operation
   * @throws NotFoundException if the major is not found
   * @throws BadRequestException if the new name already exists or is the same as the current name
   */
  async update(
    id: number,
    updateMajorDto: UpdateMajorDto,
  ): Promise<ResponseInterface<null>> {
    const major = await this.existMajor(id);

    if (!major) {
      throw new NotFoundException('Major not found');
    }

    if (updateMajorDto.name) {
      const existingMajor = await this.majorRepository.findOne({
        where: { name: updateMajorDto.name, deletedAt: IsNull() },
      });

      if (existingMajor) {
        throw new BadRequestException('Major already exists');
      }

      if (updateMajorDto.name === major.name) {
        throw new BadRequestException('Major name cannot be the same');
      }
    }

    await this.majorRepository.update(id, updateMajorDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Major updated successfully',
    };
  }

  /**
   * Soft deletes a major by setting its deletedAt timestamp
   * @param id - The ID of the major to delete
   * @returns A response interface indicating the success of the operation
   * @throws NotFoundException if the major is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const major = await this.existMajor(id);

    if (!major) {
      throw new NotFoundException('Major not found');
    }

    await this.majorRepository.softDelete(id);

    return {
      success: true,
      statusCode: 200,
      message: 'Major deleted successfully',
    };
  }

  /**
   * Checks if a major exists in the system
   * @param id - The ID of the major to check
   * @returns The major entity if found, null otherwise
   */
  public async existMajor(id: number): Promise<Major | null> {
    const major = await this.majorRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    return major;
  }
}
