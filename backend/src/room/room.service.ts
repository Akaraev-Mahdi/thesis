import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './room.model';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room) private roomRepository: typeof Room) {}

  async create(dto: { number: string; departmentId: number }) {
    return await this.roomRepository.create(dto);
  }

  async getAll() {
    // Подгружаем вместе с инфой об отделе
    return await this.roomRepository.findAll({ include: { all: true } });
  }

  async getByDepartment(departmentId: number) {
    return await this.roomRepository.findAll({ where: { departmentId } });
  }

  async deleteRoom(id: number) {
    const room = await this.roomRepository.findByPk(id, { include: { all: true } });
    if (!room) throw new BadRequestException('Комната не найдена');

    // Проверка: есть ли в комнате вещи?
    if (room.items && room.items.length > 0) {
      throw new BadRequestException('Нельзя удалить комнату, в которой числится оборудование. Сначала переместите его.');
    }

    await room.destroy();
    return { message: 'Комната удалена' };
  }
}
