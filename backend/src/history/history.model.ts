import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Item } from '../item/item.model';
import { Room } from '../room/room.model';
import { User } from '../user/user.model';

interface HistoryCreationAttrs {
  itemId: number;
  fromRoomId: number;
  toRoomId: number;
  userId: number;
}

@Table({ tableName: 'movement_history', updatedAt: false })
export class MovementHistory extends Model<MovementHistory, HistoryCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Item)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
  declare itemId: number;

  @BelongsTo(() => Item)
  declare item: Item;

  // --- ПОЛЕ "ОТКУДА" ---
  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare fromRoomId: number;

  @BelongsTo(() => Room, { foreignKey: 'fromRoomId', as: 'fromRoom' })
  declare fromRoom: Room;

  // --- ПОЛЕ "КУДА" ---
  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare toRoomId: number;

  @BelongsTo(() => Room, { foreignKey: 'toRoomId', as: 'toRoom' })
  declare toRoom: Room;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}