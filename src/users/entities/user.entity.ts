// Dependencies
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

// Entities
import { Genders } from 'src/genders/entities/gender.entity';
import { Roles } from 'src/roles/entities/role.entity';
import { Entrepreneur } from 'src/entrepreneurs/entities/entrepreneur.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'type_document', type: 'varchar', length: 255 })
  typeDocument: string;

  @Column({ name: 'document_number', type: 'varchar', length: 255 })
  documentNumber: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => Entrepreneur, (entrepreneur) => entrepreneur.user)
  entrepreneurs: Entrepreneur[];

  @ManyToOne(() => Genders, (gender) => gender.id)
  @JoinColumn({ name: 'gender_id' })
  gender: Genders;

  @ManyToOne(() => Roles, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
