import { Controller, Post, Body, Get, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { PaymentsService, MpesaPaymentRequest } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiResponse } from '../common/dto/response.dto';
import { Public } from '../common/decorators/public.decorator';
 
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mpesa/stkpush')
  @UseGuards(JwtAuthGuard)
  async initiateMpesaPayment(
    @Body(ValidationPipe) paymentData: MpesaPaymentRequest,
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const result = await this.paymentsService.initiateMpesaPayment(paymentData, user.id);
    return new ApiResponse(result.success, result.message, result.data);
  }

  @Post('mpesa/callback')
  @Public()
  async handleMpesaCallback(@Body() callbackData: any): Promise<any> {
    return await this.paymentsService.handleMpesaCallback(callbackData);
  }

  @Get('mpesa/status/:checkoutRequestId')
  @UseGuards(JwtAuthGuard)
  async checkPaymentStatus(@Param('checkoutRequestId') checkoutRequestId: string): Promise<ApiResponse<any>> {
    const result = await this.paymentsService.checkPaymentStatus(checkoutRequestId);
    return new ApiResponse(result.success, result.message || 'Payment status retrieved', result.data);
  }
}
