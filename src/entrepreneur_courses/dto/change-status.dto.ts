import { IsNumber, IsNotEmpty } from 'class-validator';

export class ChangeStatusDto {
  @IsNumber()
  @IsNotEmpty()
  statusId: number;
}
