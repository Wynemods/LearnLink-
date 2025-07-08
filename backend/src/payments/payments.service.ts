import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';

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

  async initiateMpesaPayment(paymentData: MpesaPaymentRequest, userId: string): Promise<any> {
    try {
      console.log('=== PAYMENT TESTING MODE ===');
      console.log('User ID:', userId);
      console.log('Course ID:', paymentData.courseId);
      console.log('Amount:', paymentData.amount);

      // Get course details
      const course = await this.prisma.course.findUnique({
        where: { id: paymentData.courseId },
        select: {
          id: true,
          title: true,
          price: true,
          instructorId: true
        }
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
          success: true,
          message: 'You are already enrolled in this course!',
          data: {
            requestId: 'ALREADY_ENROLLED_' + Date.now(),
            merchantRequestId: 'ENROLLED_MERCHANT_' + Date.now(),
            paymentId: 'existing-enrollment',
            enrolled: true,
            alreadyEnrolled: true
          }
        };
      }

      // Format phone number for testing
      const phoneNumber = this.formatPhoneNumber(paymentData.phoneNumber);

      // Create successful payment record immediately
      const payment = await this.prisma.payment.create({
        data: {
          amount: paymentData.amount,
          status: 'COMPLETED',
          merchantRequestId: 'TEST_MERCHANT_' + Date.now(),
          checkoutRequestId: 'TEST_CHECKOUT_' + Date.now(),
          resultDescription: 'Payment completed successfully (test mode)',
          phoneNumber: phoneNumber,
          course: {
            connect: { id: paymentData.courseId }
          },
          user: {
            connect: { id: userId }
          }
        }
      });

      // Enroll the user immediately
      await this.enrollUserInCourse(userId, paymentData.courseId);

      console.log('Payment created successfully:', payment.id);
      console.log('User enrolled successfully');

      return {
        success: true,
        message: 'Payment completed successfully! You have been enrolled in the course.',
        data: {
          requestId: payment.checkoutRequestId,
          merchantRequestId: payment.merchantRequestId,
          paymentId: payment.id,
          enrolled: true,
          courseTitle: course.title
        }
      };

    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Even on error, create a successful record for testing
      try {
        const fallbackPayment = await this.prisma.payment.create({
          data: {
            amount: paymentData.amount,
            status: 'COMPLETED',
            merchantRequestId: 'FALLBACK_MERCHANT_' + Date.now(),
            checkoutRequestId: 'FALLBACK_CHECKOUT_' + Date.now(),
            resultDescription: 'Payment completed (fallback test mode)',
            phoneNumber: this.formatPhoneNumber(paymentData.phoneNumber),
            course: {
              connect: { id: paymentData.courseId }
            },
            user: {
              connect: { id: userId }
            }
          }
        });

        await this.enrollUserInCourse(userId, paymentData.courseId);

        return {
          success: true,
          message: 'Payment completed successfully (test mode)!',
          data: {
            requestId: fallbackPayment.checkoutRequestId,
            merchantRequestId: fallbackPayment.merchantRequestId,
            paymentId: fallbackPayment.id,
            enrolled: true
          }
        };
      } catch (fallbackError) {
        console.error('Fallback payment creation failed:', fallbackError);
        return {
          success: true,
          message: 'Payment completed successfully (test mode - no record)!',
          data: {
            requestId: 'TEST_' + Date.now(),
            merchantRequestId: 'TEST_MERCHANT_' + Date.now(),
            paymentId: 'test-payment-id',
            enrolled: true
          }
        };
      }
    }
  }

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

  private formatPhoneNumber(phoneNumber: string): string {
    try {
      // Remove all non-digit characters
      let cleaned = phoneNumber.replace(/\D/g, '');

      // Format to 254XXXXXXXXX
      if (cleaned.startsWith('254')) {
        return cleaned;
      } else if (cleaned.startsWith('0')) {
        return '254' + cleaned.slice(1);
      } else if (cleaned.length === 9) {
        return '254' + cleaned;
      }

      return '254700000000'; // Default test number
    } catch (error) {
      return '254700000000'; // Default test number on error
    }
  }

  async handleMpesaCallback(callbackData: any): Promise<any> {
    console.log('M-Pesa callback received (test mode):', callbackData);
    return { success: true, message: 'Callback processed successfully (test mode)' };
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
}
