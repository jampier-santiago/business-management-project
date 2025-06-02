// Dependencies
import { Module } from '@nestjs/common';

// Services
import { RolesService } from './roles.service';

// Controllers
import { RolesController } from './roles.controller';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
