export class PaymentResponseDto {
  status: 'success' | 'failed';
  message: string;
  data?: {
    paymentId: string;
    merchantRequestId: string;
    checkoutRequestId: string;
    mpesaReceiptNumber: string;
    enrolled: boolean;
  };
}