import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponse, UserResponseDto } from '../common/dto/response.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<ApiResponse<UserResponseDto>> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    
    try {
      // Check if passwords match
      if (registerDto.password !== registerDto.confirmPassword) {
        this.logger.warn(`Password mismatch for email: ${registerDto.email}`);
        throw new BadRequestException('Passwords do not match');
      }

      // Check if user already exists
      this.logger.log(`Checking if user exists for email: ${registerDto.email}`);
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: registerDto.email },
            { username: registerDto.email },
          ],
        },
      });

      if (existingUser) {
        this.logger.warn(`User already exists with email: ${registerDto.email}`);
        throw new BadRequestException('User already exists with this email');
      }

      // Hash password
      this.logger.log(`Hashing password for email: ${registerDto.email}`);
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      this.logger.log(`Generated verification token for email: ${registerDto.email}`);

      // Create user
      this.logger.log(`Creating user in database for email: ${registerDto.email}`);
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          username: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          password: hashedPassword,
          role: registerDto.accountType === 'instructor' ? Role.INSTRUCTOR : Role.STUDENT,
          verificationToken,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          isVerified: true,
          profilePicture: true,
          createdAt: true,
        },
      });

      this.logger.log(`User created successfully with ID: ${user.id}`);

      // Send verification email
      this.logger.log(`Attempting to send verification email to: ${user.email}`);
      try {
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        this.logger.log(`Verification email sent successfully to: ${user.email}`);
      } catch (emailError) {
        this.logger.error(`Failed to send verification email to: ${user.email}`, emailError.stack);
        // Don't throw here - user is created, just email failed
        this.logger.warn(`Continuing with registration despite email failure`);
      }

      return new ApiResponse(
        true,
        'Registration successful. Please check your email to verify your account.',
        this.mapToUserResponse(user),
      );
    } catch (error) {
      this.logger.error(`Registration failed for email: ${registerDto.email}`, error.stack);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Check if it's a Prisma error
      if (error.code === 'P2002') {
        this.logger.error(`Prisma unique constraint violation for email: ${registerDto.email}`);
        throw new BadRequestException('User already exists with this email');
      }
      
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<ApiResponse<{ user: UserResponseDto; token: string }>> {
    this.logger.log(`Login attempt for username: ${loginDto.username}`);
    
    try {
      const user = await this.validateUser(loginDto.username, loginDto.password);
      
      if (!user) {
        this.logger.warn(`Invalid credentials for username: ${loginDto.username}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isVerified) {
        this.logger.warn(`Unverified account login attempt for username: ${loginDto.username}`);
        throw new UnauthorizedException('Please verify your email before logging in');
      }

      if (!user.isActive) {
        this.logger.warn(`Inactive account login attempt for username: ${loginDto.username}`);
        throw new UnauthorizedException('Account is inactive');
      }

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Generate JWT token
      const payload = { 
        sub: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      };
      
      const expiresIn = loginDto.rememberMe ? '30d' : '7d';
      const token = this.jwtService.sign(payload, { expiresIn });

      this.logger.log(`Login successful for user ID: ${user.id}`);

      return new ApiResponse(
        true,
        'Login successful',
        {
          user: this.mapToUserResponse(user),
          token,
        },
      );
    } catch (error) {
      this.logger.error(`Login failed for username: ${loginDto.username}`, error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ApiResponse<null>> {
    this.logger.log(`Forgot password request for email: ${forgotPasswordDto.email}`);
    
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: forgotPasswordDto.email },
      });

      if (!user) {
        this.logger.warn(`Forgot password request for non-existent email: ${forgotPasswordDto.email}`);
        // Don't reveal if user exists or not
        return new ApiResponse(
          true,
          'If an account with this email exists, a password reset link has been sent.',
        );
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Save reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email
      try {
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
        this.logger.log(`Password reset email sent to: ${user.email}`);
      } catch (emailError) {
        this.logger.error(`Failed to send password reset email to: ${user.email}`, emailError.stack);
      }

      return new ApiResponse(
        true,
        'If an account with this email exists, a password reset link has been sent.',
      );
    } catch (error) {
      this.logger.error(`Forgot password failed for email: ${forgotPasswordDto.email}`, error.stack);
      throw new BadRequestException('Failed to process password reset request');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ApiResponse<null>> {
    this.logger.log(`Password reset attempt with token: ${resetPasswordDto.token.substring(0, 10)}...`);
    
    try {
      // Check if passwords match
      if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
        this.logger.warn(`Password mismatch in reset attempt`);
        throw new BadRequestException('Passwords do not match');
      }

      // Find user with valid reset token
      const user = await this.prisma.user.findFirst({
        where: {
          resetToken: resetPasswordDto.token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        this.logger.warn(`Invalid or expired reset token: ${resetPasswordDto.token.substring(0, 10)}...`);
        throw new BadRequestException('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 12);

      // Update password and clear reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      this.logger.log(`Password reset successful for user ID: ${user.id}`);

      return new ApiResponse(
        true,
        'Password reset successful. You can now login with your new password.',
      );
    } catch (error) {
      this.logger.error(`Password reset failed`, error.stack);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Password reset failed');
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user: ${username}`);
    
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username },
        ],
      },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      this.logger.log(`User validation successful for: ${username}`);
      const { password, ...result } = user;
      return result;
    }
    
    this.logger.warn(`User validation failed for: ${username}`);
    return null;
  }

  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    this.logger.log(`Email verification attempt with token: ${token.substring(0, 10)}...`);
    
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          verificationToken: token,
        },
      });

      if (!user) {
        this.logger.warn(`Invalid verification token: ${token.substring(0, 10)}...`);
        throw new BadRequestException('Invalid verification token');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      this.logger.log(`Email verification successful for user ID: ${user.id}`);

      return new ApiResponse(
        true,
        'Email verified successfully. You can now login.',
      );
    } catch (error) {
      this.logger.error(`Email verification failed`, error.stack);
      throw new BadRequestException('Email verification failed');
    }
  }

  private mapToUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    };
  }
}