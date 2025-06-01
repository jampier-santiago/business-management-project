// Dependencies
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
