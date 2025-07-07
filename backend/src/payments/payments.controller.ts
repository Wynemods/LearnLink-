import { Controller, Post, Body, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/dto/response.dto';

export class STKPushDto {
  phoneNumber: string;
  amount: number;
  accountNumber: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly mpesaService: MpesaService,
    private readonly prisma: PrismaService
  ) {}

  @Post('mpesa/stkpush')
  async initiateSTKPush(@Body() stkPushDto: STKPushDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.mpesaService.initiateSTKPush(
        stkPushDto.phoneNumber,
        stkPushDto.amount,
        stkPushDto.accountNumber || 'COURSE001'
      );

      return new ApiResponse(true, result.message, result.data);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Payment initiation failed',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('mpesa/callback')
  async handleMpesaCallback(@Body() callbackData: any): Promise<void> {
    try {
      await this.mpesaService.handleCallback(callbackData);
    } catch (error) {
      console.error('Error processing M-Pesa callback:', error);
    }
  }

  @Get('mpesa/status/:checkoutRequestId')
  async getPaymentStatus(@Param('checkoutRequestId') checkoutRequestId: string): Promise<ApiResponse<any>> {
    try {
      const payment = await this.prisma.payment.findFirst({
        where: { checkoutRequestId },
      });

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      return new ApiResponse(true, 'Payment status retrieved', {
        status: payment.status,
        amount: payment.amount,
        phoneNumber: payment.phoneNumber,
        mpesaReceiptNumber: payment.mpesaReceiptNumber,
        transactionDate: payment.transactionDate,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get payment status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
