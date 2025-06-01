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
import { CitiesService } from './cities.service';

// DTOs
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseCity } from './interfaces/cities.interfaces';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseCity[]>> {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseInterface<ResponseCity>> {
    return this.citiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<ResponseInterface<null>> {
    return this.citiesService.update(+id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.citiesService.remove(+id);
  }
}
