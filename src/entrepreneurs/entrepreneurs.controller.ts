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
import { EntrepreneursService } from './entrepreneurs.service';

// DTOs
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDto } from './dto/update-entrepreneur.dto';
import { ValidateEntrepreneurNameDto } from './dto/validate-entrepreneur.dto';

// Interfaces
import { ResponseEntrepreneur } from './interfaces/entrepreneurs.interfaces';
import { ResponseInterface } from '../shared/interfaces/response.interfaces';

@Controller('entrepreneurs')
export class EntrepreneursController {
  constructor(private readonly entrepreneursService: EntrepreneursService) {}

  @Post()
  create(
    @Body() createEntrepreneurDto: CreateEntrepreneurDto,
  ): Promise<ResponseInterface<ResponseEntrepreneur>> {
    return this.entrepreneursService.create(createEntrepreneurDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseEntrepreneur[]>> {
    return this.entrepreneursService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<ResponseInterface<ResponseEntrepreneur>> {
    return this.entrepreneursService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEntrepreneurDto: UpdateEntrepreneurDto,
  ): Promise<ResponseInterface<null>> {
    return this.entrepreneursService.update(+id, updateEntrepreneurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.entrepreneursService.remove(+id);
  }

  @Post('validate-name')
  validateName(
    @Body() validateEntrepreneurNameDto: ValidateEntrepreneurNameDto,
  ): Promise<ResponseInterface<{ exists: boolean }>> {
    return this.entrepreneursService.validateEntrepreneurName(
      validateEntrepreneurNameDto.name,
    );
  }

  @Get('user/:userId')
  getEntrepreneurByUserId(
    @Param('userId') userId: string,
  ): Promise<ResponseInterface<ResponseEntrepreneur[]>> {
    return this.entrepreneursService.getEntrepreneurByUserId(+userId);
  }

  @Get('category/:categoryId')
  getEntrepreneurByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<ResponseInterface<ResponseEntrepreneur[]>> {
    return this.entrepreneursService.getEntrepreneurByCategoryId(+categoryId);
  }
}
