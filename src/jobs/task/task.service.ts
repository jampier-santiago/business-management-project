// Dependencies
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IsNull, LessThanOrEqual } from 'typeorm';

// Config
import { dataSource } from 'src/config/database.providers';

// Entities
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class TaskService {
  private readonly projectRepository = dataSource.getRepository(Project);

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleCron() {
    const projects = await this.projectRepository.find({
      where: {
        deletedAt: IsNull(),
        createdAt: LessThanOrEqual(
          new Date(new Date().setHours(23, 59, 59, 999)),
        ),
      },
    });

    console.log(projects);
  }
}
