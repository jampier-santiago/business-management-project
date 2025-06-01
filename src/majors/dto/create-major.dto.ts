// Dependencies
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMajorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
