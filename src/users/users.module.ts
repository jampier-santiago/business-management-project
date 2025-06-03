// Dependencies
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Services
import { UsersService } from './users.service';

// Controllers
import { UsersController } from './users.controller';

// Modules
import { GendersModule } from '../genders/genders.module';
import { RolesModule } from '../roles/roles.module';

// Services
import { GendersService } from '../genders/genders.service';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    GendersModule,
    RolesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, GendersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
