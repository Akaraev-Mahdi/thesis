import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from './department.model';
import { DepartmentController } from './department.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Room } from 'src/room/room.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Department, Room]),
    AuthModule,
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController]
})
export class DepartmentModule {}
