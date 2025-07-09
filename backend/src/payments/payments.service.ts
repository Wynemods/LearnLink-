import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import { randomUUID } from 'crypto';
import { PaymentResponseDto } from './dto/payment-response.dto';

export interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  courseId: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private coursesService: CoursesService
  ) {}

  async initiatePayment(userId: string, paymentData: PaymentRequest): Promise<PaymentResponseDto> {
    try {
      // Validate phone number
      if (!this.validatePhoneNumber(paymentData.phoneNumber)) {
        throw new BadRequestException('Invalid phone number format');
      }

      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: paymentData.courseId }
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      // Check if user is already enrolled
      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: paymentData.courseId
          }
        }
      });

      if (existingEnrollment) {
        return {
          status: 'failed',
          message: 'You are already enrolled in this course'
        };
      }

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          amount: paymentData.amount,
          phoneNumber: paymentData.phoneNumber,
          status: 'COMPLETED', // Auto-success as requested
          courseId: paymentData.courseId,
          userId: userId,
          resultDescription: 'Payment successful via M-Pesa'
        }
      });

      // Auto-enroll user in course
      await this.prisma.enrollment.create({
        data: {
          studentId: userId,
          courseId: paymentData.courseId,
          progress: 0,
          currentLesson: 1
        }
      });

      return {
        status: 'success',
        message: 'Payment successful! You have been enrolled in the course.',
        data: {
          paymentId: payment.id,
          enrolled: true
        }
      };

    } catch (error) {
      console.error('Payment error:', error);
      return {
        status: 'failed',
        message: error.message || 'Payment failed. Please try again.'
      };
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<any> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        course: {
          select: {
            title: true
          }
        }
      }
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    return {
      status: payment.status === 'COMPLETED' ? 'success' : 'failed',
      message: payment.resultDescription || 'Payment processed',
      data: {
        paymentId: payment.id,
        amount: payment.amount,
        courseTitle: payment.course.title,
        enrolled: payment.status === 'COMPLETED'
      }
    };
  }

  async getUserPayments(userId: string): Promise<any[]> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            thumbnail: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return payments.map(payment => ({
      id: payment.id,
      courseTitle: payment.course.title,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.createdAt,
      method: 'M-Pesa' // Default payment method
    }));
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Kenyan phone number validation
    const kenyaPhoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    return kenyaPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }
}
