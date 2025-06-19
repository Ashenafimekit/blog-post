import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { userDto } from 'src/zod';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name, { timestamp: true });
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profile: true,
        },
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found ');
    }
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: userDto,
    imageUrl: string | undefined,
  ) {
    try {
      const findUser = await this.prisma.user.findUnique({ where: { id: id } });
      if (!findUser) {
        throw new NotFoundException('user not found');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          ...(updateUserDto.name && { name: updateUserDto.name }),
          ...(updateUserDto.email && { email: updateUserDto.email }),
          ...(imageUrl && { profile: imageUrl }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          role: true,
        },
      });

      return updatedUser;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error();
    }
  }
}
