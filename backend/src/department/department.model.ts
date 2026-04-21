import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Room } from '../room/room.model';

interface DepartmentCreationAttrs {
  name: string;
}

@Table({ tableName: 'department' })
export class Department extends Model<Department, DepartmentCreationAttrs> {

  @Column({ type: DataType.STRING, allowNull: false })
    name!: string; // Например, "Бухгалтерия" или "Кафедра ИТ"

  @HasMany(() => Room)
    room!: Room[];
}
