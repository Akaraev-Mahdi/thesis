import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Метод входа
  async login(userDto: any) {
    console.log('1. Начало входа для:', userDto.login);
    const user = await this.validateUser(userDto);
    console.log('3. Пользователь валидирован, генерируем токен');
    return this.generateToken(user);
  }

  // Приватный метод для генерации токена
  private async generateToken(user: User) {
    const payload = { login: user.login, id: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fio: user.fio,
        role: user.role
      }
    };
  }

  // Проверка: существует ли юзер и подходит ли пароль
  private async validateUser(userDto: any) {
    console.log('2. Проверка пользователя в БД...');
    const user = await this.userService.getUserByLogin(userDto.login);
    if (!user) {
      throw new UnauthorizedException({ message: 'Неверный логин или пароль' });
    }

    const passwordEquals = await bcrypt.compare(userDto.password, user.password_hash);
    if (user && passwordEquals) {
      return user;
    }
    
    throw new UnauthorizedException({ message: 'Неверный логин или пароль' });
  }
}
