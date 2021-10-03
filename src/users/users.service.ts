import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async getByEmail(email: string): Promise<User> {
    const user = this.usersRepository.findOne({ email });

    if (user) return user;

    throw new HttpException(
      'User with this email not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number): Promise<User> {
    const user = this.usersRepository.findOne({ id });

    if (user) return user;

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(userData);
    await this.usersRepository.save(user);

    return user;
  }
}
