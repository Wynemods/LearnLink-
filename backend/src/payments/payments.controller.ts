import { Controller, Post, Body, Get, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { PaymentsService, PaymentRequest } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiResponse } from '../common/dto/response.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async initiatePayment(
    @Body(ValidationPipe) paymentData: PaymentRequest,
    @GetUser() user: any
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.initiatePayment(user.id, paymentData);
  }

  @Get('status/:paymentId')
  async checkPaymentStatus(
    @Param('paymentId') paymentId: string,
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const result = await this.paymentsService.checkPaymentStatus(paymentId);
    return new ApiResponse(true, 'Payment status retrieved successfully', result);
  }

  @Get('my-payments')
  async getMyPayments(@GetUser() user: any): Promise<ApiResponse<any[]>> {
    const payments = await this.paymentsService.getUserPayments(user.id);
    return new ApiResponse(true, 'Payments retrieved successfully', payments);
  }
}
