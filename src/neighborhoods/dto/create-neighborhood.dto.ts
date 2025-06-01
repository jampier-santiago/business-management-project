// Dependencies
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNeighborhoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  city_id: number;
}
