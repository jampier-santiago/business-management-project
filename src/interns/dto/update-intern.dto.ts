import { IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateInternDto {
  @IsOptional()
  @IsNumber()
  semester: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @IsOptional()
  majorId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
