import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { PostImageType } from 'src/post/types/post-image.type';
import { userDto } from 'src/zod';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
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
    @Body() updateUserDto: userDto,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      const filename = `post-${uniqueSuffix}${ext}`;
      const fullPath = path.join(uploadsDir, filename);

      console.log('before writing');
      await writeFile(fullPath, file.buffer);
      console.log('after writing');

      imageUrl = `uploads/${filename}`;
    }

    return this.userService.updateUser(id, updateUserDto, imageUrl);
  }
}
