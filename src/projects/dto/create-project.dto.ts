// Dependencies
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  requireAccompaniment: boolean;

  @IsNumber()
  @IsNotEmpty()
  entrepreneurId: number;

  @IsNumber()
  @IsNotEmpty()
  statusProjectId: number;
}
