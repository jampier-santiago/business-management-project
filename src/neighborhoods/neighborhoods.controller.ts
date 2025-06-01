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
import { NeighborhoodsService } from './neighborhoods.service';

// DTOs
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';

// Interfaces
import { ResponseNeighborhood } from './interfaces/neighborhoods.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Post()
  create(
    @Body() createNeighborhoodDto: CreateNeighborhoodDto,
  ): Promise<ResponseInterface<null>> {
    return this.neighborhoodsService.create(createNeighborhoodDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseNeighborhood[]>> {
    return this.neighborhoodsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
  ): Promise<ResponseInterface<ResponseNeighborhood>> {
    return this.neighborhoodsService.findOne(+id);
  }

  @Get('city/:cityId')
  findNeighborhoodsByCity(
    @Param('cityId') cityId: number,
  ): Promise<ResponseInterface<ResponseNeighborhood[]>> {
    return this.neighborhoodsService.findNeighborhoodsByCity(+cityId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNeighborhoodDto: UpdateNeighborhoodDto,
  ) {
    return this.neighborhoodsService.update(+id, updateNeighborhoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.neighborhoodsService.remove(+id);
  }
}
