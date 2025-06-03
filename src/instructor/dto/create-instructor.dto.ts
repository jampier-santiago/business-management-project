// Dependencies
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInstructorDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  majorId: number;
}
