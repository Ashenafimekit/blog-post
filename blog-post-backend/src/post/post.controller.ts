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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUser } from 'src/common/decorator/current-user';
import { User } from '@prisma/client';
import {
  // Action,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly prisma: PrismaService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('count')
  async totalPosts() {
    const total = await this.prisma.post.count({ where: { deletedAt: null } });
    return { total };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts(
    @CurrentUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    // console.log('🚀 ~ PostController ~ user:', user);
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    return this.postService.getAllPosts(pageNumber, limitNumber);

    // const ability = this.caslAbilityFactory.createForUser(user);
    // const posts = this.postService.getAllPosts(pageNumber, limitNumber);
    // if (ability.can(Action.Read, 'Post')) {
    //   return posts;
    // }
    // return null;
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
  async deletePost(
    @Param('id') id: string,
    @Body('authorId') authorId: string,
  ) {
    const deletedPost = await this.postService.deletePost(id, authorId);
    return deletedPost;
  }
}
