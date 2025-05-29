import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusProjectDto } from './create-status_project.dto';

export class UpdateStatusProjectDto extends PartialType(CreateStatusProjectDto) {}
