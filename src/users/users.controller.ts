// Dependencies
import { Controller, Post, Body } from '@nestjs/common';

// Services
import { UsersService } from './users.service';

// DTOs
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseUser } from './interfaces/users.interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('create')
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface<ResponseUser>> {
    return this.usersService.create(createUserDto);
  }
}
