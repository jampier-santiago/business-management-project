// Dependencies
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

// Services
import { RolesService } from './roles.service';

// DTOs
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseRole } from './interfaces/roles.interfaces';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseInterface<ResponseRole>> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseRole[]>> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseInterface<ResponseRole>> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
