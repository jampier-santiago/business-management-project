// Dependencies
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// DTOs
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

// Interfaces
import { ResponseGender } from './interfaces/genders.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Genders } from './entities/gender.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class GendersService {
  private genderRepository = dataSource.getRepository(Genders);

  /**
   * Creates a new gender
   * @param createGenderDto - The data transfer object containing gender information
   * @returns A response object indicating the success of the operation
   * @throws BadRequestException if the gender already exists
   */
  async create(
    createGenderDto: CreateGenderDto,
  ): Promise<ResponseInterface<null>> {
    const gender = await this.genderRepository.findOne({
      where: {
        name: createGenderDto.name,
        deletedAt: IsNull(),
      },
    });

    if (gender) {
      throw new BadRequestException('Gender already exists');
    }

    await this.genderRepository.save(createGenderDto);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Gender created successfully',
    };
  }

  /**
   * Retrieves all active genders
   * @returns A response object containing an array of genders
   */
  async findAll(): Promise<ResponseInterface<ResponseGender[]>> {
    const genders = await this.genderRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Genders fetched successfully',
      data: genders.map((gender) => ({
        id: gender.id,
        name: gender.name,
      })),
    };
  }

  /**
   * Retrieves a specific gender by ID
   * @param id - The ID of the gender to retrieve
   * @returns A response object containing the gender information
   * @throws NotFoundException if the gender is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseGender>> {
    const gender = await this.existGender(id);

    if (!gender) {
      throw new NotFoundException('Gender not found');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Gender fetched successfully',
      data: {
        id: gender.id,
        name: gender.name,
      },
    };
  }

  /**
   * Updates a specific gender
   * @param id - The ID of the gender to update
   * @param updateGenderDto - The data transfer object containing updated gender information
   * @returns A response object indicating the success of the operation
   * @throws NotFoundException if the gender is not found
   */
  async update(
    id: number,
    updateGenderDto: UpdateGenderDto,
  ): Promise<ResponseInterface<null>> {
    const gender = await this.existGender(id);

    if (!gender) {
      throw new NotFoundException('Gender not found');
    }

    await this.genderRepository.update(id, updateGenderDto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Gender updated successfully',
    };
  }

  /**
   * Soft deletes a specific gender
   * @param id - The ID of the gender to delete
   * @returns A response object indicating the success of the operation
   * @throws NotFoundException if the gender is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const gender = await this.existGender(id);

    if (!gender) {
      throw new NotFoundException('Gender not found');
    }

    await this.genderRepository.softDelete(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Gender deleted successfully',
    };
  }

  /**
   * Checks if a gender exists and is not deleted
   * @param id - The ID of the gender to check
   * @returns The gender entity if found, null otherwise
   */
  async existGender(id: number): Promise<Genders | null> {
    const gender = await this.genderRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    return gender;
  }
}
