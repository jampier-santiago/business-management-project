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
import { MajorsService } from './majors.service';

// DTOs
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseMajor } from './interfaces/majors.interfaces';

@Controller('majors')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @Post()
  create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorsService.create(createMajorDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseMajor[]>> {
    return this.majorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseInterface<ResponseMajor>> {
    return this.majorsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto,
  ): Promise<ResponseInterface<null>> {
    return this.majorsService.update(+id, updateMajorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.majorsService.remove(+id);
  }
}
