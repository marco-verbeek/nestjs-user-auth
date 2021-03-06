import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getAllUsers() {
    return this.usersService.getUsers();
  }
}
