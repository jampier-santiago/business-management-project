// Entities
import { Genders } from 'src/genders/entities/gender.entity';
import { Roles } from 'src/roles/entities/role.entity';

export interface ResponseUser {
  id: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  typeDocument: string;
  documentNumber: string;
  birthDate: Date;
  gender: Genders;
  role: Roles;
}
