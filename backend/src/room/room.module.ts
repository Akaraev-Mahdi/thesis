import { Module } from '@nestjs/common';
import { RoomsService } from './room.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './room.model';
import { RoomsController } from './room.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Room]),
    AuthModule,
  ],
  providers: [RoomsService],
  controllers: [RoomsController]
})
export class RoomModule {}
