// Dependencies
import { Module } from '@nestjs/common';

// Services
import { GendersService } from './genders.service';

// Controllers
import { GendersController } from './genders.controller';

@Module({
  controllers: [GendersController],
  providers: [GendersService],
  exports: [GendersService],
})
export class GendersModule {}
