import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
