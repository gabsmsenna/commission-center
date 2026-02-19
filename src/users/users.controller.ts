import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import {
  PaginatedUsersResponse,
  UserResponse,
  UsersService,
} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedUsersResponse> {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.softDelete(id);
  }
}
