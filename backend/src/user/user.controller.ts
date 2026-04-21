import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users') // Базовый роут: http://localhost:3000/users
export class UserController {
  constructor(private usersService: UserService) {}

  // Создание нового пользователя
  // POST http://localhost:3000/users
  @Roles('ADMIN') // Указываем, что только админ может...
  @UseGuards(RolesGuard) // ...пройти через этот гвард
  @Post()
  create(@Body() userDto: any) {
    // В userDto должны прийти: fio, login, password, role, departmentId
    return this.usersService.createUser(userDto);
  }

  // Получение всех пользователей
  // GET http://localhost:3000/users
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  // Получение одного пользователя по ID
  // GET http://localhost:3000/users/5
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
