import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusCourseDto } from './create-status_course.dto';

export class UpdateStatusCourseDto extends PartialType(CreateStatusCourseDto) {}
