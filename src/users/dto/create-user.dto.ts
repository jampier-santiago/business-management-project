// Dependencies
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum TypeDocument {
  CC = 'CC',
  CE = 'CE',
  TI = 'TI',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  genderId: number;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsEnum(TypeDocument)
  @IsNotEmpty()
  typeDocument: TypeDocument;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
