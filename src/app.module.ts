import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectRevenueModule } from './project_revenue/project_revenue.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, ProjectsModule, ProjectRevenueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
