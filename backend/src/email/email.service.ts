import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as ejs from 'ejs';

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
    
    const templatePath = path.join(__dirname, 'templates', 'verification.ejs');
    const html = await ejs.renderFile(templatePath, {
      verificationUrl,
      email,
    });

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_USER'),
      to: email,
      subject: 'Verify Your Email - LearnLink',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    
    const templatePath = path.join(__dirname, 'templates', 'password-reset.ejs');
    const html = await ejs.renderFile(templatePath, {
      resetUrl,
      email,
    });

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_USER'),
      to: email,
      subject: 'Password Reset - LearnLink',
      html,
    });
  }
}
