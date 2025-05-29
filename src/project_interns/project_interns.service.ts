import { Injectable } from '@nestjs/common';
import { CreateProjectInternDto } from './dto/create-project_intern.dto';
import { UpdateProjectInternDto } from './dto/update-project_intern.dto';

@Injectable()
export class ProjectInternsService {
  create(createProjectInternDto: CreateProjectInternDto) {
    return 'This action adds a new projectIntern';
  }

  findAll() {
    return `This action returns all projectInterns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectIntern`;
  }

  update(id: number, updateProjectInternDto: UpdateProjectInternDto) {
    return `This action updates a #${id} projectIntern`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectIntern`;
  }
}
