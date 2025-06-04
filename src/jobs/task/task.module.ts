// Dependencies
import { Module } from '@nestjs/common';

// Services
import { TaskService } from './task.service';

@Module({
  providers: [TaskService],
})
export class TaskModule {}
