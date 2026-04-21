import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomsService } from './room.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  create(@Body() dto: { number: string; departmentId: number }) {
    return this.roomsService.create(dto);
  }

  @Get()
  getAll() {
    return this.roomsService.getAll();
  }

  @Get('department/:id')
  getByDept(@Param('id') id: number) {
    return this.roomsService.getByDepartment(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.roomsService.deleteRoom(id);
  }
}
