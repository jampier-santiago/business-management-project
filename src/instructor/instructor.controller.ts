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
import { InstructorService } from './instructor.service';

// DTO's
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

// Interfaces
import { ResponseInterface } from 'src/shared/interfaces/response.interfaces';
import { ResponseInstructor } from './interfaces/instructors.interfaces';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  @Get()
  findAll(): Promise<ResponseInterface<ResponseInstructor[]>> {
    return this.instructorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return this.instructorService.update(+id, updateInstructorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorService.remove(+id);
  }
}
