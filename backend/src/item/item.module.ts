import { Module } from '@nestjs/common';
import { ItemsService } from './item.service';
import { ItemsController } from './item.controller';
import { Item } from './item.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MovementHistory } from 'src/history/history.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Item, MovementHistory]),
    AuthModule,
  ],
  providers: [ItemsService],
  controllers: [ItemsController]
})
export class ItemModule {}
