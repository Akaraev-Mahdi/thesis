import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './user/user.model';
import { Department } from './department/department.model';
import { Room } from './room/room.model';
import { Item, ItemCreationAttrs } from './item/item.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DbInitService implements OnModuleInit {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Department) private deptModel: typeof Department,
    @InjectModel(Room) private roomModel: typeof Room,
    @InjectModel(Item) private itemModel: typeof Item,
  ) {}

  async onModuleInit() {
    const userCount = await this.userModel.count();
    
    // Если в базе нет пользователей, значит она пустая — заполняем
    if (userCount === 0) {
      console.log('--- Инициализация демонстрационных данных ---');

      // 1. Создаем Подразделения
      const depts = await this.deptModel.bulkCreate([
        { name: 'Администрация' },
        { name: 'IT-отдел' },
        { name: 'Бухгалтерия' },
        { name: 'Кафедра ИТ' },
      ]);

      // 2. Создаем Кабинеты
      const rooms = await this.roomModel.bulkCreate([
        { number: '101 (Приемная)', departmentId: depts[0].id },
        { number: '205 (Серверная)', departmentId: depts[1].id },
        { number: '301 (Главбух)', departmentId: depts[2].id },
        { number: '401 (Комп. класс)', departmentId: depts[3].id },
      ]);

      // 3. Создаем Админа
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userModel.create({
        fio: 'Администратор Системы',
        login: 'admin',
        password_hash: hashedPassword,
        role: UserRole.ADMIN,
        departmentId: depts[0].id,
      });

    const itemsData: ItemCreationAttrs[] = [
        { 
          name: 'Ноутбук Lenovo ThinkPad', 
          inventoryNumber: 'ИНВ-001', 
          status: 'active', 
          roomId: rooms[0].id 
        },
        { 
          name: 'Сервер HP ProLiant', 
          inventoryNumber: 'ИНВ-002', 
          status: 'active', 
          roomId: rooms[1].id 
        },
        { 
          name: 'Принтер Kyocera', 
          inventoryNumber: 'ИНВ-003', 
          status: 'repair', 
          roomId: rooms[2].id 
        },
        { 
          name: 'Монитор Dell 24"', 
          inventoryNumber: 'ИНВ-004', 
          status: 'active', 
          roomId: rooms[3].id 
        },
        { 
          name: 'Проектор Epson', 
          inventoryNumber: 'ИНВ-005', 
          status: 'retired', 
          roomId: rooms[3].id 
        },
    ];

      // 4. Создаем Предметы
      await this.itemModel.bulkCreate(itemsData as any);

      console.log('--- База данных успешно наполнена! ---');
      console.log('Логин: admin, Пароль: admin123');
    }
  }
}
