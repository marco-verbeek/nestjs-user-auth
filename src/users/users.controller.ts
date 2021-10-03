import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/authentication/guards/jwt-authentication.guard';
import { CreateUserDto } from './dtos/create-user.dto';
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

  @Post()
  async createUser(@Body() userData: CreateUserDto) {}
}
