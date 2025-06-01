// Dependencies
import { Module } from '@nestjs/common';

// Services
import { CitiesService } from './cities.service';

// Controllers
import { CitiesController } from './cities.controller';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
