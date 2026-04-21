import { Controller, Post, Get, Body, Delete, UseGuards, Param } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('departments')
export class DepartmentController {
  constructor(private departmentsService: DepartmentService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  create(@Body('name') name: string) {
    return this.departmentsService.create(name);
  }

  @Get()
  getAll() {
    return this.departmentsService.getAll();
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.departmentsService.deleteDepartment(id);
  }

}
