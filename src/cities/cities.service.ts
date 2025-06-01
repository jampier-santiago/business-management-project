// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// DTOs
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { City } from './entities/city.entity';

// Interfaces
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseCity } from './interfaces/cities.interfaces';
import { IsNull } from 'typeorm';

@Injectable()
export class CitiesService {
  private cityRepository = dataSource.getRepository(City);

  /**
   * Creates a new city in the system
   * @param {CreateCityDto} createCityDto - Data transfer object containing the city information to be created
   * @returns {Promise<ResponseInterface<ResponseCity>>} A promise that resolves to an object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (201 for creation success)
   * - message: string describing the result of the operation
   */
  async create(
    createCityDto: CreateCityDto,
  ): Promise<ResponseInterface<ResponseCity>> {
    const city = this.cityRepository.create(createCityDto);
    await this.cityRepository.save(city);

    return {
      success: true,
      statusCode: 201,
      message: 'City created successfully',
    };
  }

  /**
   * Retrieves all cities from the database
   * @returns {Promise<ResponseInterface<ResponseCity[]>>} A promise that resolves to an object containing:
   * - success: boolean indicating if the operation was successful
   * - message: string describing the result of the operation
   * - data: array of cities with their id and name
   */
  async findAll(): Promise<ResponseInterface<ResponseCity[]>> {
    const cities = await this.cityRepository.find({
      select: { deletedAt: false },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Cities fetched successfully',
      data: cities.map((city) => ({
        id: city.id,
        name: city.name,
      })),
    };
  }

  /**
   * Retrieves a single city by its ID
   * @param {number} id - The unique identifier of the city to be retrieved
   * @returns {Promise<ResponseInterface<ResponseCity>>} A promise that resolves to an object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200 for success)
   * - message: string describing the result of the operation
   * - data: object containing the city's id and name
   * @throws {NotFoundException} When the city with the specified id is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseCity>> {
    const city = await this.cityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'City fetched successfully',
      data: {
        id: city.id,
        name: city.name,
      },
    };
  }

  /**
   * Updates an existing city's information
   * @param {number} id - The unique identifier of the city to be updated
   * @param {UpdateCityDto} updateCityDto - Data transfer object containing the new city information
   * @returns {Promise<ResponseInterface<null>>} A promise that resolves to an object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200 for success)
   * - message: string describing the result of the operation
   * @throws {NotFoundException} When the city with the specified id is not found
   * @throws {BadRequestException} When the city name is empty or unchanged
   */
  async update(
    id: number,
    updateCityDto: UpdateCityDto,
  ): Promise<ResponseInterface<null>> {
    const city = await this.cityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    if (updateCityDto.name === '') {
      throw new BadRequestException('City name is required');
    }

    if (updateCityDto.name === city.name) {
      throw new BadRequestException('City name is the same');
    }

    const existingCity = await this.cityRepository.findOne({
      where: { name: updateCityDto.name, deletedAt: IsNull() },
    });

    if (existingCity) {
      throw new BadRequestException('City name already exists');
    }

    await this.cityRepository.update(id, {
      name: updateCityDto.name,
    });

    return {
      success: true,
      statusCode: 200,
      message: 'City updated successfully',
    };
  }

  /**
   * Performs a logical deletion of a city by setting its deletedAt timestamp
   * @param {number} id - The unique identifier of the city to be deleted
   * @returns {Promise<ResponseInterface<null>>} A promise that resolves to an object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200 for success)
   * - message: string describing the result of the operation
   * @throws {NotFoundException} When the city with the specified id is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const city = await this.cityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    await this.cityRepository.update(id, { deletedAt: new Date() });

    return {
      success: true,
      statusCode: 200,
      message: 'City deleted successfully',
    };
  }
}
