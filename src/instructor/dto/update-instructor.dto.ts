import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateInstructorDto {
  @IsNumber()
  @IsNotEmpty()
  majorId: number;
}
