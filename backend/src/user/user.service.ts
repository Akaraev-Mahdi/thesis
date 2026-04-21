import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  // Внедряем модель User в сервис
  constructor(
    @InjectModel(User) 
    private userRepository: typeof User
  ) {}

  // Метод создания пользователя (используется админом)
  async createUser(dto: CreateUserDto) {
    // Проверяем, нет ли уже пользователя с таким логином
    const candidate = await this.userRepository.findOne({ where: { login: dto.login } });
    if (candidate) {
      throw new BadRequestException('Пользователь с таким логином уже существует');
    }

    // Хешируем пароль перед сохранением (10 — уровень сложности шифрования)
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Создаем запись в БД
    const user = await this.userRepository.create({
      ...dto,
      password_hash: hashedPassword
    });

    return user;
  }

  // Получение всех пользователей с их подразделениями
  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  // Поиск пользователя по логину (понадобится для авторизации)
  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({ 
      where: { login }, 
      include: { all: true } 
    });
    return user;
  }

  // Получение одного пользователя по ID
  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, { include: { all: true } });
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (user) await user.destroy();
    return { message: 'Пользователь удален' };
  }
}
