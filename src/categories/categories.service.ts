// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// DTOs
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseCategory } from './interfaces/categories.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Category } from './entities/category.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class CategoriesService {
  private categoryRepository = dataSource.getRepository(Category);

  /**
   * Creates a new category
   * @param createCategoryDto - The data transfer object containing category information
   * @returns A response object containing the created category data
   * @throws BadRequestException if a category with the same name already exists
   */
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseInterface<ResponseCategory>> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, deletedAt: IsNull() },
    });

    if (existingCategory) {
      throw new BadRequestException('Category name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    await this.categoryRepository.save(category);

    return {
      success: true,
      statusCode: 201,
      message: 'Category created successfully',
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    };
  }

  /**
   * Retrieves all non-deleted categories
   * @returns A response object containing an array of all categories
   */
  async findAll(): Promise<ResponseInterface<ResponseCategory[]>> {
    const categories = await this.categoryRepository.find({
      select: { deletedAt: false },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Categories fetched successfully',
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
      })),
    };
  }

  /**
   * Retrieves a specific category by its ID
   * @param id - The ID of the category to retrieve
   * @returns A response object containing the requested category data
   * @throws NotFoundException if the category is not found
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseCategory>> {
    const category = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Category fetched successfully',
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    };
  }

  /**
   * Updates an existing category
   * @param id - The ID of the category to update
   * @param updateCategoryDto - The data transfer object containing updated category information
   * @returns A response object indicating successful update
   * @throws NotFoundException if the category is not found
   * @throws BadRequestException if the name or description is empty or if the name already exists
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!updateCategoryDto.name || updateCategoryDto.name === '') {
      throw new BadRequestException('Category name is required');
    }

    if (
      !updateCategoryDto.description ||
      updateCategoryDto.description === ''
    ) {
      throw new BadRequestException('Category description is required');
    }

    if (updateCategoryDto.name === category.name) {
      throw new BadRequestException('Category name is the same');
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: { name: updateCategoryDto.name, deletedAt: IsNull() },
    });

    if (existingCategory) {
      throw new BadRequestException('Category name already exists');
    }

    await this.categoryRepository.update(id, updateCategoryDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Category updated successfully',
    };
  }

  /**
   * Soft deletes a category by setting its deletedAt timestamp
   * @param id - The ID of the category to delete
   * @returns A response object indicating successful deletion
   * @throws NotFoundException if the category is not found
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const category = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.update(id, { deletedAt: new Date() });

    return {
      success: true,
      statusCode: 200,
      message: 'Category deleted successfully',
    };
  }
}
