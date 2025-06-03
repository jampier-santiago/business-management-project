// Dependencies
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

// DTO's
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateInternDto extends CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  semester: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @IsNotEmpty()
  majorId: number;
}
