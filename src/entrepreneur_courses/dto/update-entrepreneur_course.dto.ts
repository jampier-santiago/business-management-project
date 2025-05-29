import { PartialType } from '@nestjs/mapped-types';
import { CreateEntrepreneurCourseDto } from './create-entrepreneur_course.dto';

export class UpdateEntrepreneurCourseDto extends PartialType(CreateEntrepreneurCourseDto) {}
