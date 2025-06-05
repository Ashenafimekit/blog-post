import { Controller, UseGuards, Post, Request, Get, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auhtService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: { email: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auhtService.login(req.user);
    // console.log('🚀 ~ AuthController ~ result:', result);

    res.cookie('access_token', result.user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      success: true,
      user: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { id: string; email: string } }): unknown {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: { logout: () => any }): unknown {
    return req.logout();
  }
}
