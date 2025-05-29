import { Injectable } from '@nestjs/common';
import { CreateStatusProjectDto } from './dto/create-status_project.dto';
import { UpdateStatusProjectDto } from './dto/update-status_project.dto';

@Injectable()
export class StatusProjectService {
  create(createStatusProjectDto: CreateStatusProjectDto) {
    return 'This action adds a new statusProject';
  }

  findAll() {
    return `This action returns all statusProject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statusProject`;
  }

  update(id: number, updateStatusProjectDto: UpdateStatusProjectDto) {
    return `This action updates a #${id} statusProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusProject`;
  }
}
