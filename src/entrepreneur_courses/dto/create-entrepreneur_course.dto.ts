// Dependencies
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEntrepreneurCourseDto {
  @IsNotEmpty()
  @IsNumber()
  entrepreneurId: number;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsNumber()
  statusId: number;
}
