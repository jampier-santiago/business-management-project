// Dependencies
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
