// Dependencies
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

// DTOs
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDto } from './dto/update-entrepreneur.dto';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Entrepreneur } from './entities/entrepreneur.entity';

// Interfaces
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseEntrepreneur } from './interfaces/entrepreneurs.interfaces';

// Services
import { CategoriesService } from '../categories/categories.service';
import { NeighborhoodsService } from '../neighborhoods/neighborhoods.service';
import { UsersService } from '../users/users.service';
import { IsNull } from 'typeorm';

@Injectable()
export class EntrepreneursService {
  private entrepreneurRepository = dataSource.getRepository(Entrepreneur);

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly neighborhoodsService: NeighborhoodsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new entrepreneur
   * @param createEntrepreneurDto - Data transfer object containing entrepreneur information
   * @returns Promise with response containing the created entrepreneur
   * @throws BadRequestException if entrepreneur already exists, category not found, neighborhood not found, or user not found
   */
  async create(
    createEntrepreneurDto: CreateEntrepreneurDto,
  ): Promise<ResponseInterface<ResponseEntrepreneur>> {
    const queryRunner =
      this.entrepreneurRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const existingEntrepreneur = await queryRunner.manager.findOne(
      Entrepreneur,
      {
        where: {
          name: createEntrepreneurDto.name,
        },
      },
    );

    if (existingEntrepreneur) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Entrepreneur already exists');
    }

    const category = await this.categoriesService.validateCategory(
      createEntrepreneurDto.categoryId,
    );

    if (!category) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Category not found');
    }

    const neighborhood = await this.neighborhoodsService.validateNeighborhood(
      createEntrepreneurDto.neighborhoodId,
    );

    if (!neighborhood) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Neighborhood not found');
    }

    const user = await this.usersService.validateUser(
      createEntrepreneurDto.userId,
    );

    if (!user) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('User not found');
    }

    const entrepreneur = this.entrepreneurRepository.create({
      ...createEntrepreneurDto,
      category: { id: category.id },
      neighborhood: { id: neighborhood.id },
      user: { id: user.id },
    });

    await queryRunner.manager.save(Entrepreneur, entrepreneur);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Entrepreneur created successfully',
      data: entrepreneur,
    };
  }

  /**
   * Retrieves all active entrepreneurs
   * @returns Promise with response containing array of entrepreneurs
   */
  async findAll(): Promise<ResponseInterface<ResponseEntrepreneur[]>> {
    const entrepreneurs = await this.entrepreneurRepository.find({
      relations: {
        neighborhood: true,
        user: true,
        category: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneurs fetched successfully',
      data: entrepreneurs.map((entrepreneur) => ({
        name: entrepreneur.name,
        phoneNumber: entrepreneur.phoneNumber,
        email: entrepreneur.email,
        requiresEventInformation: entrepreneur.requiresEventInformation,
        address: entrepreneur.address,
        isActive: entrepreneur.isActive,
        neighborhood: {
          id: entrepreneur.neighborhood.id,
          name: entrepreneur.neighborhood.name,
        },
        user: {
          id: entrepreneur.user.id,
          name: entrepreneur.user.name,
          email: entrepreneur.user.email,
        },
        category: {
          id: entrepreneur.category.id,
          name: entrepreneur.category.name,
        },
      })),
    };
  }

  /**
   * Retrieves a specific entrepreneur by ID
   * @param id - The ID of the entrepreneur to find
   * @returns Promise with response containing the found entrepreneur
   * @throws BadRequestException if entrepreneur is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseEntrepreneur>> {
    const entrepreneur = await this.validateEntrepreneur(id);

    if (!entrepreneur) {
      throw new BadRequestException('Entrepreneur not found');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur fetched successfully',
      data: {
        name: entrepreneur.name,
        phoneNumber: entrepreneur.phoneNumber,
        email: entrepreneur.email,
        requiresEventInformation: entrepreneur.requiresEventInformation,
        address: entrepreneur.address,
        isActive: entrepreneur.isActive,
        neighborhood: {
          id: entrepreneur.neighborhood.id,
          name: entrepreneur.neighborhood.name,
        },
        user: {
          id: entrepreneur.user.id,
          name: entrepreneur.user.name,
          email: entrepreneur.user.email,
        },
        category: {
          id: entrepreneur.category.id,
          name: entrepreneur.category.name,
        },
      },
    };
  }

  /**
   * Updates an existing entrepreneur
   * @param id - The ID of the entrepreneur to update
   * @param updateEntrepreneurDto - Data transfer object containing updated information
   * @returns Promise with response indicating success
   * @throws BadRequestException if entrepreneur not found, category not found, neighborhood not found, or name validation fails
   */
  async update(
    id: number,
    updateEntrepreneurDto: UpdateEntrepreneurDto,
  ): Promise<ResponseInterface<null>> {
    const entrepreneur = await this.validateEntrepreneur(id);

    if (!entrepreneur) {
      throw new BadRequestException('Entrepreneur not found');
    }

    if (updateEntrepreneurDto.categoryId) {
      const category = await this.categoriesService.validateCategory(
        updateEntrepreneurDto.categoryId,
      );

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    if (updateEntrepreneurDto.neighborhoodId) {
      const neighborhood = await this.neighborhoodsService.validateNeighborhood(
        updateEntrepreneurDto.neighborhoodId,
      );

      if (!neighborhood) {
        throw new BadRequestException('Neighborhood not found');
      }
    }

    if (entrepreneur.name) {
      if (updateEntrepreneurDto.name === '') {
        throw new BadRequestException('Entrepreneur name is required');
      }

      if (entrepreneur.name === updateEntrepreneurDto.name) {
        throw new BadRequestException('Entrepreneur name is the same');
      }

      if (entrepreneur.name !== updateEntrepreneurDto.name) {
        const existingEntrepreneur = await this.entrepreneurRepository.findOne({
          where: { name: updateEntrepreneurDto.name },
        });

        if (existingEntrepreneur) {
          throw new BadRequestException('Entrepreneur already exists');
        }
      }
    }

    await this.entrepreneurRepository.update(id, {
      ...updateEntrepreneurDto,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur updated successfully',
    };
  }

  /**
   * Soft deletes an entrepreneur by setting deletedAt timestamp
   * @param id - The ID of the entrepreneur to remove
   * @returns Promise with response indicating success
   * @throws BadRequestException if entrepreneur is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const entrepreneur = await this.validateEntrepreneur(id);

    if (!entrepreneur) {
      throw new BadRequestException('Entrepreneur not found');
    }

    await this.entrepreneurRepository.softDelete(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur deleted successfully',
    };
  }

  /**
   * Validates if an entrepreneur exists and is not deleted
   * @param id - The ID of the entrepreneur to validate
   * @returns Promise with the entrepreneur entity if found and not deleted, null otherwise
   */
  public async validateEntrepreneur(id: number): Promise<Entrepreneur | null> {
    const entrepreneur = await this.entrepreneurRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        neighborhood: true,
        user: true,
        category: true,
      },
    });

    return entrepreneur;
  }

  /**
   * Validates if an entrepreneur name already exists
   * @param name - The name to validate
   * @returns Promise with response indicating if the name exists
   */
  public async validateEntrepreneurName(
    name: string,
  ): Promise<ResponseInterface<{ exists: boolean }>> {
    const entrepreneur = await this.entrepreneurRepository.findOne({
      where: { name, deletedAt: IsNull() },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur name validated successfully',
      data: {
        exists: entrepreneur ? true : false,
      },
    };
  }

  /**
   * Retrieves all entrepreneurs associated with a specific user
   * @param userId - The ID of the user
   * @returns Promise with response containing array of entrepreneurs
   */
  public async getEntrepreneurByUserId(
    userId: number,
  ): Promise<ResponseInterface<ResponseEntrepreneur[]>> {
    const entrepreneur = await this.entrepreneurRepository.find({
      where: { user: { id: userId }, deletedAt: IsNull() },
      relations: {
        neighborhood: true,
        user: true,
        category: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur fetched successfully',
      data: entrepreneur.map((entrepreneur) => ({
        name: entrepreneur.name,
        phoneNumber: entrepreneur.phoneNumber,
        email: entrepreneur.email,
        requiresEventInformation: entrepreneur.requiresEventInformation,
        address: entrepreneur.address,
        isActive: entrepreneur.isActive,
        neighborhood: {
          id: entrepreneur.neighborhood.id,
          name: entrepreneur.neighborhood.name,
        },
        user: {
          id: entrepreneur.user.id,
          name: entrepreneur.user.name,
          email: entrepreneur.user.email,
        },
        category: {
          id: entrepreneur.category.id,
          name: entrepreneur.category.name,
        },
      })),
    };
  }

  /**
   * Retrieves all entrepreneurs in a specific category
   * @param categoryId - The ID of the category
   * @returns Promise with response containing array of entrepreneurs
   */
  public async getEntrepreneurByCategoryId(
    categoryId: number,
  ): Promise<ResponseInterface<ResponseEntrepreneur[]>> {
    const entrepreneur = await this.entrepreneurRepository.find({
      where: { category: { id: categoryId }, deletedAt: IsNull() },
      relations: {
        neighborhood: true,
        user: true,
        category: true,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Entrepreneur fetched successfully',
      data: entrepreneur.map((entrepreneur) => ({
        name: entrepreneur.name,
        phoneNumber: entrepreneur.phoneNumber,
        email: entrepreneur.email,
        requiresEventInformation: entrepreneur.requiresEventInformation,
        address: entrepreneur.address,
        isActive: entrepreneur.isActive,
        neighborhood: {
          id: entrepreneur.neighborhood.id,
          name: entrepreneur.neighborhood.name,
        },
        user: {
          id: entrepreneur.user.id,
          name: entrepreneur.user.name,
          email: entrepreneur.user.email,
        },
        category: {
          id: entrepreneur.category.id,
          name: entrepreneur.category.name,
        },
      })),
    };
  }
}
