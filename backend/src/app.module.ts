import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { RoomModule } from './room/room.module';
import { ItemModule } from './item/item.module';
import { User } from './user/user.model';
import { Department } from './department/department.model';
import { Room } from './room/room.model';
import { Item } from './item/item.model';
import { AuthModule } from './auth/auth.module';
import { MovementHistory } from './history/history.model';
import { DbInitService } from './db-init.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Department, Room, Item, MovementHistory],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([User, Department, Room, Item, MovementHistory]),
    UserModule,
    DepartmentModule,
    RoomModule,
    ItemModule,
    AuthModule,
  ],
  controllers: [],
  providers: [DbInitService],
})
export class AppModule {}
