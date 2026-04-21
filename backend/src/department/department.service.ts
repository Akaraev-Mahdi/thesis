import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './department.model';
import { Room } from 'src/room/room.model';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department)
    private departmentRepository: typeof Department,
  ) {}

  async create(name: string) {
    const department = await this.departmentRepository.create({ name });
    return department;
  }

  async getAll() {
    const departments = await this.departmentRepository.findAll({ include: [Room] });
    return departments;
  }

  async deleteDepartment(id: number) {
    const dept = await this.departmentRepository.findByPk(id, { include: { all: true } });
    if (!dept) throw new BadRequestException('Отдел не найден');

    // Проверка: есть ли в отделе комнаты?
    if (dept.room && dept.room.length > 0) {
      throw new BadRequestException('Сначала удалите или переместите комнаты этого подразделения');
    }

    await dept.destroy();
    return { message: 'Подразделение удалено' };
  }
}

