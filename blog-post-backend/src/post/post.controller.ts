import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
// import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { CreatePostDto, PostSchema } from 'src/zod';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUser } from 'src/common/decorator/current-user';
import { User } from '@prisma/client';
import {
  // Action,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ZodValiationPipe } from 'src/common/pipes/zod-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { PostImageType } from './types/post-image.type';

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
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp|jpg)' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body(new ZodValiationPipe(PostSchema))
    createPostDto: CreatePostDto,
  ) {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = extname(file.originalname);
    const filename = `post-${uniqueSuffix}${ext}`;
    const fullPath = path.join(uploadsDir, filename);

    await writeFile(fullPath, file.buffer);
    const image: PostImageType = {
      originalName: file.originalname,
      fileName: filename,
      path: `uploads/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };

    const createdPost = await this.postService.createPost(createPostDto, image);
    return createdPost;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp|jpg)' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
    @Body()
    updatePostDto: { title?: string; content?: string; authorId: string },
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
