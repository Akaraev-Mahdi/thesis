import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './item.model';
import { MovementHistory } from 'src/history/history.model';
import { User } from 'src/user/user.model';
import { Room } from 'src/room/room.model';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item) private itemRepository: typeof Item,
    @InjectModel(MovementHistory) private historyRepository: typeof MovementHistory
) {}

  async create(dto: any) {
    // Проверка на уникальность инвентарного номера
    const candidate = await this.itemRepository.findOne({ 
      where: { inventoryNumber: dto.inventoryNumber } 
    });
    if (candidate) {
      throw new BadRequestException('Предмет с таким инвентарным номером уже существует');
    }
    return await this.itemRepository.create(dto);
  }

  async getAll() {
    // Загружаем предмет вместе с комнатой и отделом этой комнаты (глубокая связь)
    return await this.itemRepository.findAll({ include: { all: true, nested: true } });
  }

  // Удаление вещи
  async deleteItem(id: number) {
    const item = await this.itemRepository.findByPk(id);
    if (!item) throw new BadRequestException('Предмет не найден');
    await item.destroy();
    return { message: 'Удалено успешно' };
  }

  async getItemHistory(itemId: number) {
    return await this.historyRepository.findAll({
      where: { itemId },
      include: [
        { model: User, attributes: ['fio'] }, // Кто переместил
        { model: Room, as: 'fromRoom', attributes: ['number'] }, // Откуда (нужен алиас, если настроен в модели)
        { model: Room, as: 'toRoom', attributes: ['number'] }    // Куда
      ],
      order: [['createdAt', 'DESC']] // Сначала новые
    });
  }

  // Редактирование (опечатки, статус, название)
  async update(id: number, dto: any, userId: number) {
    const item = await this.itemRepository.findByPk(id);
    if (!item) throw new BadRequestException('Предмет не найден');

    const oldRoomId = item.roomId;
    const newRoomId = Number(dto.roomId);

    console.log(oldRoomId, newRoomId)

    // Если кабинет изменился — записываем в историю
    if (newRoomId && oldRoomId !== newRoomId) {
      await this.historyRepository.create({
        itemId: item.id,
        fromRoomId: oldRoomId,
        toRoomId: newRoomId,
        userId: userId // ID того, кто нажал "Сохранить"
      });
    }

    await item.update(dto);
    return item;
  }
}
