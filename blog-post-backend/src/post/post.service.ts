import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { PostImageType } from './types/post-image.type';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name, { timestamp: true });

  constructor(private readonly prisma: PrismaService) {}

  async getAllPosts(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const posts = await this.prisma.post.findMany({
        where: { deletedAt: null },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          images: true,
        },
      });
      console.log(posts);
      return posts;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('Failed to fetch posts');
    }
  }

  async getPostById(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: id, deletedAt: null },
        include: {
          author: true,
          images: true,
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error();
    }
  }

  async createPost(createPostDto: CreatePostDto, image: PostImageType) {
    const { title, content, authorId } = createPostDto;

    console.log('🚀 ~ PostService ~ createPost ~ image:', image);
    console.log(
      '🚀 ~ PostService ~ createPost ~ createPostDto:',
      createPostDto,
    );

    try {
      const post = await this.prisma.post.create({
        data: {
          title: title,
          content: content,
          published: true,
          images: {
            create: {
              originalName: image.originalName,
              fileName: image.fileName,
              size: image.size,
              mimetype: image.mimetype,
              path: image.path,
            },
          },
          author: {
            connect: {
              id: authorId,
            },
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
      return post;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async updatePost(updatePostDto: UpdatePostDto, id: string) {
    const { title, content, authorId } = updatePostDto;
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: id },
      });
      if (post?.authorId !== authorId) {
        throw new UnauthorizedException("can't update another author post");
      }
      const updatePost = await this.prisma.post.update({
        where: { id: id },
        data: {
          title: title,
          content: content,
          author: {
            connect: {
              id: authorId,
            },
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
      if (!updatePost) {
        throw new NotFoundException('Post not found');
      }
      return updatePost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('Failed to update post');
    }
  }

  async deletePost(id: string, auhorId: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: id },
      });
      if (post?.authorId !== auhorId) {
        throw new UnauthorizedException("can't delete another author post");
      }
      const deletePost = await this.prisma.post.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          author: true,
          images: true,
        },
      });
      if (!deletePost) {
        throw new NotFoundException('Post not found');
      }
      return deletePost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('Failed to delete post');
    }
  }
}
