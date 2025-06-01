// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTOs
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';

// Interfaces
import { ResponseNeighborhood } from './interfaces/neighborhoods.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Neighborhood } from './entities/neighborhood.entity';

// Services
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class NeighborhoodsService {
  private neighborhoodRepository = dataSource.getRepository(Neighborhood);

  constructor(private readonly citiesService: CitiesService) {}

  /**
   * Creates a new neighborhood
   * @param createNeighborhoodDto - Data transfer object containing neighborhood creation data
   * @returns Promise with response indicating successful creation
   * @throws BadRequestException if neighborhood already exists
   * @throws NotFoundException if city does not exist
   */
  async create(
    createNeighborhoodDto: CreateNeighborhoodDto,
  ): Promise<ResponseInterface<null>> {
    const existingNeighborhood = await this.neighborhoodRepository.findOne({
      where: {
        name: createNeighborhoodDto.name,
        deletedAt: IsNull(),
        city: { id: createNeighborhoodDto.city_id, deletedAt: IsNull() },
      },
      relations: {
        city: true,
      },
    });

    if (existingNeighborhood) {
      throw new BadRequestException('Neighborhood already exists');
    }

    const city = await this.citiesService.existCity(
      createNeighborhoodDto.city_id,
    );

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const neighborhood = this.neighborhoodRepository.create({
      name: createNeighborhoodDto.name,
      city: { id: createNeighborhoodDto.city_id },
    });

    await this.neighborhoodRepository.save(neighborhood);

    return {
      success: true,
      statusCode: 201,
      message: 'Neighborhood created successfully',
    };
  }

  /**
   * Retrieves all active neighborhoods
   * @returns Promise with response containing array of neighborhoods
   */
  async findAll(): Promise<ResponseInterface<ResponseNeighborhood[]>> {
    const neighborhoods = await this.neighborhoodRepository.find({
      where: { deletedAt: IsNull() },
      relations: {
        city: true,
      },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Neighborhoods fetched successfully',
      data: neighborhoods.map((neighborhood) => ({
        id: neighborhood.id,
        name: neighborhood.name,
        city: {
          id: neighborhood.city.id,
          name: neighborhood.city.name,
        },
      })),
    };
  }

  /**
   * Retrieves a specific neighborhood by ID
   * @param id - The ID of the neighborhood to retrieve
   * @returns Promise with response containing the neighborhood data
   * @throws NotFoundException if neighborhood is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseNeighborhood>> {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        city: true,
      },
    });

    if (!neighborhood) {
      throw new NotFoundException('Neighborhood not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Neighborhood fetched successfully',
      data: {
        id: neighborhood.id,
        name: neighborhood.name,
        city: {
          id: neighborhood.city.id,
          name: neighborhood.city.name,
        },
      },
    };
  }

  /**
   * Updates a neighborhood's information
   * @param id - The ID of the neighborhood to update
   * @param updateNeighborhoodDto - Data transfer object containing update information
   * @returns Promise with response indicating successful update
   * @throws NotFoundException if neighborhood or city is not found
   */
  async update(
    id: number,
    updateNeighborhoodDto: UpdateNeighborhoodDto,
  ): Promise<ResponseInterface<null>> {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!neighborhood) {
      throw new NotFoundException('Neighborhood not found');
    }

    if (updateNeighborhoodDto.city_id) {
      const city = await this.citiesService.existCity(
        updateNeighborhoodDto.city_id,
      );

      if (!city) {
        throw new NotFoundException('City not found');
      }
    }

    await this.neighborhoodRepository.update(id, updateNeighborhoodDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Neighborhood updated successfully',
    };
  }

  /**
   * Soft deletes a neighborhood
   * @param id - The ID of the neighborhood to delete
   * @returns Promise with response indicating successful deletion
   * @throws NotFoundException if neighborhood is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!neighborhood) {
      throw new NotFoundException('Neighborhood not found');
    }

    await this.neighborhoodRepository.update(id, { deletedAt: new Date() });

    return {
      success: true,
      statusCode: 200,
      message: 'Neighborhood deleted successfully',
    };
  }

  /**
   * Retrieves all neighborhoods belonging to a specific city
   * @param cityId - The ID of the city to filter neighborhoods
   * @returns Promise with response containing array of neighborhoods for the specified city
   */
  async findNeighborhoodsByCity(
    cityId: number,
  ): Promise<ResponseInterface<ResponseNeighborhood[]>> {
    const neighborhoods = await this.neighborhoodRepository.find({
      where: { city: { id: cityId }, deletedAt: IsNull() },
      relations: {
        city: true,
      },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Neighborhoods fetched successfully',
      data: neighborhoods.map((neighborhood) => ({
        id: neighborhood.id,
        name: neighborhood.name,
        city: {
          id: neighborhood.city.id,
          name: neighborhood.city.name,
        },
      })),
    };
  }
}
