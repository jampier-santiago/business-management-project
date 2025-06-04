// Dependencies
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Providers
import { databaseProviders } from './config/database.providers';

// Modules
import { CitiesModule } from './cities/cities.module';
import { NeighborhoodsModule } from './neighborhoods/neighborhoods.module';
import { CategoriesModule } from './categories/categories.module';
import { EntrepreneursModule } from './entrepreneurs/entrepreneurs.module';
import { GendersModule } from './genders/genders.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { CoursesModule } from './courses/courses.module';
import { EntrepreneurCoursesModule } from './entrepreneur_courses/entrepreneur_courses.module';
import { StatusCoursesModule } from './status_courses/status_courses.module';
import { StatusProjectModule } from './status_project/status_project.module';
import { InternsModule } from './interns/interns.module';
import { ProjectInternsModule } from './project_interns/project_interns.module';
import { MajorsModule } from './majors/majors.module';
import { InstructorModule } from './instructor/instructor.module';
import { TaskService } from './jobs/task/task.service';
import { TaskModule } from './jobs/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CitiesModule,
    NeighborhoodsModule,
    CategoriesModule,
    EntrepreneursModule,
    GendersModule,
    RolesModule,
    UsersModule,
    ProjectsModule,
    CoursesModule,
    EntrepreneurCoursesModule,
    StatusCoursesModule,
    StatusProjectModule,
    InternsModule,
    ProjectInternsModule,
    MajorsModule,
    InstructorModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders, TaskService],
})
export class AppModule {}
