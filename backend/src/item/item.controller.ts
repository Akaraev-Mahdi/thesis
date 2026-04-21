import { Controller, Post, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ItemsService } from './item.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RolesGuard)
  create(@Body() dto: any) {
    return this.itemsService.create(dto);
  }

  @Get()
  getAll() {
    return this.itemsService.getAll();
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.itemsService.deleteItem(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RolesGuard)
  update(@Param('id') id: number, @Body() dto: any, @Req() req: any) {
    const userId = req.user.id; 
    return this.itemsService.update(id, dto, userId);
  }

  @Get(':id/history')
  @UseGuards(RolesGuard)
  getHistory(@Param('id') id: number) {
    return this.itemsService.getItemHistory(id);
  }

}
