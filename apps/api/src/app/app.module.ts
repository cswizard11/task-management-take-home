import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, Organization, Task } from '@task-management-take-home/data';
import { AuthModule } from './auth/auth.module';
import { OrgHierarchyModule } from './org-hierarchy/org-hierarchy.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './database.sqlite',
      entities: [User, Organization, Task],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    OrgHierarchyModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
