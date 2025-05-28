import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auhtService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: { user: { email: string; password: string } },
  ): unknown {
    return this.auhtService.login(req.user);
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
