// Dependencies
import { Module } from '@nestjs/common';

// Services
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';

// Modules
import { UsersModule } from 'src/users/users.module';
import { MajorsModule } from 'src/majors/majors.module';

@Module({
  imports: [UsersModule, MajorsModule],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
