// Dependencies
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

// Entities
import { Project } from 'src/projects/entities/project.entity';
import { Intern } from 'src/interns/entities/intern.entity';

@Entity({ name: 'project_interns' })
export class ProjectIntern {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Intern, (intern) => intern.id)
  @JoinColumn({ name: 'intern_id' })
  intern: Intern;

  @Column({ name: 'assigned_date', type: 'date' })
  assignedDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
