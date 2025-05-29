// Dependencies
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

// Entities
import { User } from 'src/users/entities/user.entity';
import { ProjectIntern } from 'src/project_interns/entities/project_intern.entity';
import { Major } from 'src/majors/entities/major.entity';

@Entity({ name: 'interns' })
export class Intern {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'semester', type: 'integer', nullable: false })
  semester: number;

  @Column({ name: 'is_active', type: 'boolean', nullable: false })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: Date;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Major, (major) => major.id)
  @JoinColumn({ name: 'major_id' })
  major: Major;

  @OneToMany(() => ProjectIntern, (projectIntern) => projectIntern.intern)
  projectInterns: ProjectIntern[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
