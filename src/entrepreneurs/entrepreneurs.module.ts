// Dependencies
import { Module } from '@nestjs/common';

// Services
import { EntrepreneursService } from './entrepreneurs.service';
import { CategoriesService } from '../categories/categories.service';
import { NeighborhoodsService } from '../neighborhoods/neighborhoods.service';
import { UsersService } from '../users/users.service';

// Controllers
import { EntrepreneursController } from './entrepreneurs.controller';

// Modules
import { CategoriesModule } from '../categories/categories.module';
import { NeighborhoodsModule } from '../neighborhoods/neighborhoods.module';
import { UsersModule } from '../users/users.module';
import { CitiesModule } from '../cities/cities.module';
import { RolesModule } from '../roles/roles.module';
import { GendersModule } from '../genders/genders.module';

@Module({
  imports: [
    CategoriesModule,
    NeighborhoodsModule,
    UsersModule,
    CitiesModule,
    RolesModule,
    GendersModule,
  ],
  controllers: [EntrepreneursController],
  providers: [
    EntrepreneursService,
    CategoriesService,
    NeighborhoodsService,
    UsersService,
  ],
  exports: [EntrepreneursService],
})
export class EntrepreneursModule {}
