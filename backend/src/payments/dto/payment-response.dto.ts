export class PaymentResponseDto {
  status: 'success' | 'failed';
  message: string;
  data?: {
    paymentId: string;
    enrolled: boolean;
  };
}