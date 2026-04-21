import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Room } from '../room/room.model';

export interface ItemCreationAttrs {
  name: string;
  inventoryNumber: string;
  status: string;
  roomId: number;
}

@Table({ tableName: 'item' })
export class Item extends Model<Item> {

  @Column({ type: DataType.STRING, allowNull: false })
    declare name: string; // Например, "Кресло офисное" или "МФУ HP"

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
    declare inventoryNumber: string; // Инвентарный номер (уникальный)

  @Column({ type: DataType.DATE })
    declare purchaseDate: Date; // Дата закупки

  @Column({
        type: DataType.ENUM('active', 'repair', 'retired'),
        defaultValue: 'active'
    })
    declare status: string; // Статус: в эксплуатации, в ремонте, списано

  @ForeignKey(() => Room)
    @Column({ type: DataType.INTEGER })
    declare roomId: number;

  @BelongsTo(() => Room)
    declare room: Room;
}
