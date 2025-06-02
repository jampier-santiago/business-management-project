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
import { GendersService } from './genders.service';

// DTOs
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

// Interfaces
import { ResponseGender } from './interfaces/genders.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Post()
  create(
    @Body() createGenderDto: CreateGenderDto,
  ): Promise<ResponseInterface<null>> {
    return this.gendersService.create(createGenderDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseGender[]>> {
    return this.gendersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseInterface<ResponseGender>> {
    return this.gendersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGenderDto: UpdateGenderDto,
  ): Promise<ResponseInterface<null>> {
    return this.gendersService.update(+id, updateGenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.gendersService.remove(+id);
  }
}
