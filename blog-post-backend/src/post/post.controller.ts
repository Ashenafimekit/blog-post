import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('count')
  async totalPosts() {
    const total = await this.prisma.post.count();
    return { total };
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    return this.postService.getAllPosts(pageNumber, limitNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    const createdPost = await this.postService.createPost(createPostDto);
    return createdPost;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const updatedPost = await this.postService.updatePost(updatePostDto, id);
    return updatedPost;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const deletedPost = await this.postService.deletePost(id);
    return deletedPost;
  }
}
