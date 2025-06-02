// Dependencies
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// DTOs
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

// Interfaces
import { ResponseInterface } from '../shared/interfaces/response.interfaces';
import { ResponseUser } from './interfaces/users.interfaces';

// Config
import { dataSource } from '../config/database.providers';

// Entities
import { User } from './entities/user.entity';

// Services
import { GendersService } from '../genders/genders.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  private userRepository = dataSource.getRepository(User);

  constructor(
    private jwtService: JwtService,
    private readonly gendersService: GendersService,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Authenticates a user and generates a JWT token
   * @param loginUserDto - The login credentials containing email and password
   * @returns An object containing the JWT token and success message
   * @throws BadRequestException if user is not found or password is invalid
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        deletedAt: IsNull(),
        email: loginUserDto.email,
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: {
        token: this.jwtService.sign(
          { id: user.id, role: user.role.id },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: '24h',
          },
        ),
      },
    };
  }

  /**
   * Creates a new user in the system
   * @param createUserDto - The user data to create a new user
   * @returns A response object indicating successful user creation
   * @throws BadRequestException if user already exists, gender not found, or role not found
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<ResponseInterface<ResponseUser>> {
    const user = await this.userRepository.findOne({
      where: {
        deletedAt: IsNull(),
        documentNumber: createUserDto.documentNumber,
      },
      relations: {
        role: true,
        gender: true,
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const gender = await this.gendersService.existGender(
      createUserDto.genderId,
    );

    if (!gender) {
      throw new BadRequestException('Gender not found');
    }

    const role = await this.rolesService.existRole(createUserDto.roleId);

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const password = await hash(createUserDto.password, 10);

    await this.userRepository.save({
      ...createUserDto,
      password,
      role: { id: role.id },
      gender: { id: gender.id },
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    };
  }

  public async validateUser(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    return user;
  }
}
