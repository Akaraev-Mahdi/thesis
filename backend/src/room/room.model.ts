import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Department } from '../department/department.model';
import { Item } from '../item/item.model';

interface RoomCreationAttrs {
  number: string;
  departmentId: number;
}

@Table({ tableName: 'room' })
export class Room extends Model<Room, RoomCreationAttrs> {

  @Column({ type: DataType.STRING, allowNull: false })
    number!: string; // Номер кабинета, например, "404а"

  @ForeignKey(() => Department)
    @Column({ type: DataType.INTEGER })
    departmentId!: number;

  @BelongsTo(() => Department)
    department!: Department;

  @HasMany(() => Item)
    declare items: Item[];
}
