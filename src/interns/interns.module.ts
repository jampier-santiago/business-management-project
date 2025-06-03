// Dependencies
import { Module } from '@nestjs/common';

// Services
import { InternsService } from './interns.service';

// Controllers
import { InternsController } from './interns.controller';

// Modules
import { UsersModule } from 'src/users/users.module';
import { MajorsModule } from 'src/majors/majors.module';

@Module({
  imports: [UsersModule, MajorsModule],
  controllers: [InternsController],
  providers: [InternsService],
  exports: [InternsService],
})
export class InternsModule {}
