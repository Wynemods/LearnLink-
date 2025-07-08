import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
        <h1 style="color:#14B8A6;">LearnLink</h1>
        <h2>Welcome to LearnLink!</h2>
        <p>Hello,</p>
        <p>Thank you for registering with LearnLink. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align:center;">
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 30px;background-color:#14B8A6;color:white;text-decoration:none;border-radius:25px;margin:20px 0;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours for security reasons.</p>
        <p>If you didn't create an account with LearnLink, please ignore this email.</p>
        <div style="text-align:center;margin-top:30px;font-size:14px;color:#666;">
          <p>Best regards,<br>The LearnLink Team</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_USER'),
      to: email,
      subject: 'Verify Your Email - LearnLink',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
        <h1 style="color:#14B8A6;">LearnLink</h1>
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your LearnLink account. Click the button below to reset your password:</p>
        <div style="text-align:center;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 30px;background-color:#14B8A6;color:white;text-decoration:none;border-radius:25px;margin:20px 0;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <div style="text-align:center;margin-top:30px;font-size:14px;color:#666;">
          <p>Best regards,<br>The LearnLink Team</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_USER'),
      to: email,
      subject: 'Password Reset - LearnLink',
      html,
    });
  }
}
