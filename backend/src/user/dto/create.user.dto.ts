import { IsString, IsNotEmpty, MinLength, IsEnum, IsOptional, IsInt } from 'class-validator';
import { UserRole } from '../user.model';

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
    @IsNotEmpty({ message: 'ФИО не может быть пустым' })
    readonly fio!: string;

  @IsString({ message: 'Должно быть строкой' })
    @MinLength(4, { message: 'Логин должен быть не меньше 4 символов' })
    readonly login!: string;

  @IsString({ message: 'Должно быть строкой' })
    @MinLength(6, { message: 'Пароль должен быть не меньше 6 символов' })
    readonly password!: string;

  @IsEnum(UserRole, { message: 'Некорректная роль' })
    readonly role!: UserRole;

  @IsOptional()
  @IsInt({ message: 'ID подразделения должен быть числом' })
  readonly departmentId?: number;
}
