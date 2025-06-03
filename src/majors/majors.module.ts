// Dependencies
import { Module } from '@nestjs/common';

// Services
import { MajorsService } from './majors.service';

// Controller
import { MajorsController } from './majors.controller';

@Module({
  controllers: [MajorsController],
  providers: [MajorsService],
  exports: [MajorsService],
})
export class MajorsModule {}
