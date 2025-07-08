import { Controller, Post, Body, Get, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { PaymentsService, MpesaPaymentRequest } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiResponse } from '../common/dto/response.dto';
import { Public } from '../common/decorators/public.decorator';
 
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

}
