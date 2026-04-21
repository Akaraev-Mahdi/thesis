import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Department } from '../department/department.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

interface UserCreationAttrs {
  fio: string;
  login: string;
  password_hash: string;
  role: UserRole;
  departmentId?: number;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.STRING, allowNull: false })
    declare fio: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
    declare login: string;

  @Column({ type: DataType.STRING, allowNull: false })
    declare password_hash: string;

  @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.VIEWER
    })
    declare role: UserRole;

  @ForeignKey(() => Department)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare departmentId: number;

  @BelongsTo(() => Department)
    department!: Department;
}