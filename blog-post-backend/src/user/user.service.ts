import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
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

  updateUser(id: string, body: any, imageUrl) {}
}
