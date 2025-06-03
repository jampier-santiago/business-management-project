import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProjectInternDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  internId: number;
}
