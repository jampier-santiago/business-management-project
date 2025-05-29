import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectInternDto } from './create-project_intern.dto';

export class UpdateProjectInternDto extends PartialType(CreateProjectInternDto) {}
