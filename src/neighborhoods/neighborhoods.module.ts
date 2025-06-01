// Dependencies
import { Module } from '@nestjs/common';

// Services
import { NeighborhoodsService } from './neighborhoods.service';
import { CitiesService } from '../cities/cities.service';

// Controllers
import { NeighborhoodsController } from './neighborhoods.controller';

// Modules
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [CitiesModule],
  controllers: [NeighborhoodsController],
  providers: [NeighborhoodsService, CitiesService],
  exports: [NeighborhoodsService],
})
export class NeighborhoodsModule {}
