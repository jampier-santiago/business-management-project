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
import { InternsService } from './interns.service';

// DTOs
import { CreateInternDto } from './dto/create-intern.dto';
import { UpdateInternDto } from './dto/update-intern.dto';

// Interfaces
import type { ResponseInterface } from '../shared/interfaces/response.interfaces';
import type { ResponseIntern } from './interfaces/interns.interfaces';

@Controller('interns')
export class InternsController {
  constructor(private readonly internsService: InternsService) {}

  @Post()
  create(
    @Body() createInternDto: CreateInternDto,
  ): Promise<ResponseInterface<ResponseIntern>> {
    return this.internsService.create(createInternDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseIntern[]>> {
    return this.internsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseInterface<ResponseIntern>> {
    return this.internsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInternDto: UpdateInternDto) {
    return this.internsService.update(+id, updateInternDto);
  }

  @Patch(':id/inactive')
  inactiveIntern(@Param('id') id: string): Promise<ResponseInterface<null>> {
    return this.internsService.inactiveIntern(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internsService.remove(+id);
  }
}
