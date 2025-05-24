// Dependencies
import { Module } from '@nestjs/common';

// Modules
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Providers
import { databaseProviders } from './config/database.providers';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
