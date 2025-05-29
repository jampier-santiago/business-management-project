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
import { Entrepreneur } from 'src/entrepreneurs/entities/entrepreneur.entity';
import { StatusProject } from 'src/status_project/entities/status_project.entity';
import { ProjectIntern } from 'src/project_interns/entities/project_intern.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'budget', type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'requires_accompaniment', type: 'boolean' })
  requiresAccompaniment: boolean;

  @ManyToOne(() => Entrepreneur, (entrepreneur) => entrepreneur.id)
  @JoinColumn({ name: 'entrepreneur_id' })
  entrepreneur: Entrepreneur;

  @ManyToOne(() => StatusProject, (statusProject) => statusProject.id)
  @JoinColumn({ name: 'status_project_id' })
  statusProject: StatusProject;

  @OneToMany(() => ProjectIntern, (projectIntern) => projectIntern.project, {
    nullable: true,
  })
  projectInterns: ProjectIntern[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
