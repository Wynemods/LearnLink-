import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as moment from 'moment';

interface STKPushResponse {
  success: boolean;
  message: string;
  data?: {
    requestId: string;
    merchantRequestId: string;
  };
}

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountNumber: string;
}

interface CallbackMetadata {
  Item: Array<{
    Name: string;
    Value: string | number;
  }>;
}

interface STKCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: CallbackMetadata;
}

@Injectable()
export class MpesaService {
  private readonly CONSUMER_KEY = 'dzNAvmDrgWdx56RcBOdmsXtayOlW2HGwOqSReEGKh2AYsXTM';
  private readonly CONSUMER_SECRET = 'dXci9XUyXkSxQL7yhp0RnlcixmEPHUfGUBkiHIqULbqAQrAjqCiiB0jpPIxtSudW';
  private readonly BUSINESS_SHORT_CODE = '174379';
  private readonly PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  private readonly CALLBACK_URL = 'https://daraja-node.vercel.app/api/callback';
  private readonly BASE_URL = 'https://sandbox.safaricom.co.ke';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) { }

  async getAccessToken(): Promise<string> {
    const url = `${this.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
    const auth = 'Basic ' + Buffer.from(this.CONSUMER_KEY + ':' + this.CONSUMER_SECRET).toString('base64');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
        timeout: 10000,
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Access token error:', error.response?.data || error.message);
      throw new HttpException('Failed to get access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async initiateSTKPush(phoneNumber: string, amount: number, accountNumber: string): Promise<STKPushResponse> {
    // Validate inputs
    if (!phoneNumber || !amount || !accountNumber) {
      throw new HttpException('Missing required parameters', HttpStatus.BAD_REQUEST);
    }

    // Format phone number
    let formattedPhone = this.formatPhoneNumber(phoneNumber);

    // Validate formatted phone number
    if (!this.isValidKenyanPhoneNumber(formattedPhone)) {
      throw new HttpException(
        'Invalid phone number format. Must be a valid Kenyan phone number',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.BASE_URL}/mpesa/stkpush/v1/processrequest`;
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const password = Buffer.from(
        this.BUSINESS_SHORT_CODE + this.PASSKEY + timestamp
      ).toString('base64');

      const requestBody = {
        BusinessShortCode: this.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: this.BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhone,
        CallBackURL: this.CALLBACK_URL,
        AccountReference: accountNumber,
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('STK Push Response:', response.data);

      if (response.data.ResponseCode === '0') {
        // Create payment record
        const payment = await this.prisma.payment.create({
          data: {
            amount: amount,
            status: 'PENDING',
            phoneNumber: formattedPhone,
            merchantRequestId: response.data.MerchantRequestID,
            checkoutRequestId: response.data.CheckoutRequestID,
            course: {
              connect: { id: accountNumber }
            },
            user: {
              connect: { id: 'user-id-placeholder' } // You'll need to pass userId to this method
            }
          },
        });

        return {
          success: true,
          message: 'STK push initiated successfully',
          data: {
            requestId: response.data.CheckoutRequestID,
            merchantRequestId: response.data.MerchantRequestID,
          },
        };
      } else {
        throw new HttpException(
          response.data.ResponseDescription || 'STK push failed',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      console.error('STK Push Error:', error.response?.data || error.message);

      if (error.response?.data?.ResponseDescription) {
        throw new HttpException(
          error.response.data.ResponseDescription,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        'Payment initiation failed. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleCallback(callbackData: any): Promise<void> {
    console.log('M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

      if (ResultCode === 0) {
        // Payment successful
        let mpesaReceiptNumber = '';
        let phoneNumber = '';

        if (CallbackMetadata && CallbackMetadata.Item) {
          CallbackMetadata.Item.forEach((item: any) => {
            switch (item.Name) {
              case 'MpesaReceiptNumber':
                mpesaReceiptNumber = item.Value;
                break;
              case 'PhoneNumber':
                phoneNumber = item.Value;
                break;
            }
          });
        }

        // Find payment by checkoutRequestId first
        const existingPayment = await this.prisma.payment.findUnique({
          where: { checkoutRequestId: CheckoutRequestID }
        });

        if (existingPayment) {
          await this.prisma.payment.update({
            where: { checkoutRequestId: CheckoutRequestID },
            data: {
              status: 'COMPLETED',
              mpesaReceiptNumber,
            },
          });
        } else {
          console.warn(`Payment not found for checkoutRequestId: ${CheckoutRequestID}`);
        }

        console.log('Payment completed successfully');
      } else {
        // Payment failed
        const existingPayment = await this.prisma.payment.findUnique({
          where: { checkoutRequestId: CheckoutRequestID }
        });

        if (existingPayment) {
          await this.prisma.payment.update({
            where: { checkoutRequestId: CheckoutRequestID },
            data: {
              status: 'FAILED',
            },
          });
        } else {
          console.warn(`Payment not found for checkoutRequestId: ${CheckoutRequestID}`);
        }

        console.log('Payment failed:', ResultDesc);
      }
    } catch (error) {
      console.error('Error processing M-Pesa callback:', error);
    }
  }

  async getPaymentStatus(checkoutRequestId: string): Promise<any> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { checkoutRequestId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          course: {
            select: {
              id: true,
              title: true,
              price: true,
              thumbnail: true
            }
          }
        }
      });

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      return {
        data: payment,
        success: true,
        message: 'Payment status retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new HttpException(
        'Failed to get payment status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    } else if (cleaned.length === 9) {
      return '254' + cleaned;
    } else {
      return cleaned;
    }
  }

  private isValidKenyanPhoneNumber(phoneNumber: string): boolean {
    return /^254[0-9]{9}$/.test(phoneNumber);
  }

  // Register URLs for C2B (Customer to Business) payments
  async registerUrls(): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.BASE_URL}/mpesa/c2b/v1/registerurl`;

      const requestBody = {
        ShortCode: this.BUSINESS_SHORT_CODE,
        ResponseType: 'Completed',
        ConfirmationURL: 'https://daraja-node.vercel.app/api/confirmation',
        ValidationURL: 'https://daraja-node.vercel.app/api/validation',
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });

      console.log('URL Registration Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('URL Registration Error:', error.response?.data || error.message);
      throw new HttpException('Failed to register URLs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}