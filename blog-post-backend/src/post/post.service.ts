import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPosts(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const posts = await this.prisma.post.findMany({
        where: { deletedAt: null },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return posts;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  async getPostById(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: id, deletedAt: null },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error();
    }
  }

  async createPost(createPostDto: CreatePostDto) {
    const { title, content, published, authorId } = createPostDto;
    console.log(
      '🚀 ~ PostService ~ createPost ~ createPostDto:',
      createPostDto,
    );

    try {
      const post = await this.prisma.post.create({
        data: {
          title: title,
          content: content,
          published: published,
          author: {
            connect: {
              id: authorId,
            },
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  async updatePost(updatePostDto: UpdatePostDto, id: string) {
    const { title, content, published, authorId } = updatePostDto;
    try {
      const post = await this.prisma.post.update({
        where: { id: id },
        data: {
          title: title,
          content: content,
          published: published,
          author: {
            connect: {
              id: authorId,
            },
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return post;
    } catch (error) {
      console.error('Error updating post:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update post');
    }
  }

  async deletePost(id: string) {
    try {
      const post = await this.prisma.post.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return post;
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete post');
    }
  }
}
