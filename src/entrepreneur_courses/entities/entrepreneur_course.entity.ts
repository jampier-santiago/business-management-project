// Dependencies
import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Entities
import { Entrepreneur } from 'src/entrepreneurs/entities/entrepreneur.entity';
import { Course } from 'src/courses/entities/course.entity';
import { StatusCourse } from 'src/status_courses/entities/status_course.entity';

@Entity({ name: 'entrepreneur_courses' })
export class EntrepreneurCourse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Entrepreneur, (entrepreneur) => entrepreneur.id)
  @JoinColumn({ name: 'entrepreneur_id' })
  entrepreneur: Entrepreneur;

  @ManyToOne(() => Course, (course) => course.id)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => StatusCourse, (statusCourse) => statusCourse.id)
  @JoinColumn({ name: 'status_course_id' })
  statusCourse: StatusCourse;

  @Column({ name: 'assigned_at', type: 'date' })
  assignedAt: Date;

  @Column({ name: 'completed_at', type: 'date', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
