// Dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull } from 'typeorm';

// DTOs
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { Roles } from './entities/role.entity';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseRole } from './interfaces/roles.interfaces';

@Injectable()
export class RolesService {
  private roleRepository = dataSource.getRepository(Roles);

  /**
   * Creates a new role in the database.
   *
   * @param {CreateRoleDto} createRoleDto - The role data to create
   * @returns {Promise<ResponseInterface<ResponseRole>>} A promise that resolves to a response object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (201)
   * - message: Success message
   *
   * @throws {BadRequestException} If a role with the same name already exists
   */
  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<ResponseInterface<ResponseRole>> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name, deletedAt: IsNull() },
    });

    if (existingRole) {
      throw new BadRequestException('Role name already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);

    return {
      success: true,
      statusCode: 201,
      message: 'Role created successfully',
    };
  }

  /**
   * Retrieves all active roles from the database.
   *
   * @returns {Promise<ResponseInterface<ResponseRole[]>>} A promise that resolves to a response object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200)
   * - message: Success message
   * - data: Array of roles with their id and name
   *
   */
  async findAll(): Promise<ResponseInterface<ResponseRole[]>> {
    const roles = await this.roleRepository.find({
      select: { deletedAt: false },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Roles fetched successfully',
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
    };
  }

  /**
   * Retrieves a specific role by its ID.
   *
   * @param {number} id - The ID of the role to find
   * @returns {Promise<ResponseInterface<ResponseRole>>} A promise that resolves to a response object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200)
   * - message: Success message
   * - data: Object containing the role's id and name
   *
   * @throws {NotFoundException} If no role is found with the provided ID
   */
  async findOne(id: number): Promise<ResponseInterface<ResponseRole>> {
    const role = await this.existRole(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Role fetched successfully',
      data: {
        id: role.id,
        name: role.name,
      },
    };
  }

  /**
   * Updates a role's name by its ID.
   *
   * @param {number} id - The ID of the role to update
   * @param {UpdateRoleDto} updateRoleDto - The data containing the new role name
   * @returns {Promise<ResponseInterface<null>>} A promise that resolves to a response object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200)
   * - message: Success message
   *
   * @throws {NotFoundException} If no role is found with the provided ID
   * @throws {BadRequestException} If:
   * - The role name is empty or not provided
   * - The new name is the same as the current name
   * - A role with the new name already exists
   */
  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseInterface<null>> {
    const role = await this.existRole(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (!updateRoleDto.name || updateRoleDto.name === '') {
      throw new BadRequestException('Role name is required');
    }

    if (updateRoleDto.name === role.name) {
      throw new BadRequestException('Role name is the same');
    }

    const existingRole = await this.roleRepository.findOne({
      where: { name: updateRoleDto.name, deletedAt: IsNull() },
    });

    if (existingRole) {
      throw new BadRequestException('Role name already exists');
    }

    await this.roleRepository.update(id, { name: updateRoleDto.name });

    return {
      success: true,
      statusCode: 200,
      message: 'Role updated successfully',
    };
  }

  /**
   * Soft deletes a role by setting its deletedAt timestamp.
   *
   * @param {number} id - The ID of the role to delete
   * @returns {Promise<ResponseInterface<null>>} A promise that resolves to a response object containing:
   * - success: boolean indicating if the operation was successful
   * - statusCode: HTTP status code (200)
   * - message: Success message
   *
   * @throws {NotFoundException} If no role is found with the provided ID
   */
  async remove(id: number): Promise<ResponseInterface<null>> {
    const role = await this.existRole(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.softDelete(id);

    return {
      success: true,
      statusCode: 200,
      message: 'Role deleted successfully',
    };
  }

  /**
   * Checks if a role exists in the database by its ID.
   *
   * @param {number} id - The ID of the role to check
   * @returns {Promise<Roles | null>} A promise that resolves to:
   * - The role object if found
   * - null if no role is found with the provided ID
   */
  async existRole(id: number): Promise<Roles | null> {
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    return role;
  }
}
