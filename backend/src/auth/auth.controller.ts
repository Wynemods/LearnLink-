import { Controller, Post, Body, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponse, UserResponseDto } from '../common/dto/response.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<ApiResponse<{ user: UserResponseDto; token: string }>> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponse<null>> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<ApiResponse<null>> {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: any): Promise<ApiResponse<UserResponseDto>> {
    return new ApiResponse(true, 'Profile retrieved successfully', user);
  }
}
