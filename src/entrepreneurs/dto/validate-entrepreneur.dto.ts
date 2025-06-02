// Dependencies
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateEntrepreneurNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
