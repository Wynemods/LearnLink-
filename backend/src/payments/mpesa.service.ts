import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as moment from 'moment';
import * as fs from 'fs';

interface STKPushResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable()
export class MpesaService {
  private readonly CONSUMER_KEY = 'dzNAvmDrgWdx56RcBOdmsXtayOlW2HGwOqSReEGKh2AYsXTM';
  private readonly CONSUMER_SECRET = 'dXci9XUyXkSxQL7yhp0RnlcixmEPHUfGUBkiHIqULbqAQrAjqCiiB0jpPIxtSudW';
  private readonly BUSINESS_SHORT_CODE = '174379';
  private readonly PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  private readonly CALLBACK_URL = 'https://daraja-node.vercel.app/api/callback';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getAccessToken(): Promise<string> {
    const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = 'Basic ' + Buffer.from(this.CONSUMER_KEY + ':' + this.CONSUMER_SECRET).toString('base64');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      return response.data.access_token;
    } catch (error) {
      throw new HttpException('Failed to get access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async initiateSTKPush(phoneNumber: string, amount: number, accountNumber: string): Promise<STKPushResponse> {
    // Validate phone number
    if (!phoneNumber) {
      throw new HttpException('Phone number is required', HttpStatus.BAD_REQUEST);
    }

    // Format phone number
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('+254')) {
      formattedPhone = phoneNumber.slice(1);
    } else if (phoneNumber.startsWith('0')) {
      formattedPhone = '254' + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith('254')) {
      formattedPhone = '254' + phoneNumber;
    }

    // Validate formatted phone number
    if (!/^254\d{9}$/.test(formattedPhone)) {
      throw new HttpException(
        'Invalid phone number format. Must be Kenyan phone number',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const password = Buffer.from(
        this.BUSINESS_SHORT_CODE + this.PASSKEY + timestamp
      ).toString('base64');

      const requestData = {
        BusinessShortCode: this.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: 1, // Fixed amount as requested
        PartyA: formattedPhone,
        PartyB: this.BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhone,
        CallBackURL: this.CALLBACK_URL,
        AccountReference: accountNumber,
        TransactionDesc: 'LearnLink Course Payment',
      };

      const response = await axios.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Store payment request in database
      await this.prisma.payment.create({
        data: {
          checkoutRequestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID,
          phoneNumber: formattedPhone,
          amount: 1,
          accountReference: accountNumber,
          status: 'PENDING',
        },
      });

      return {
        success: true,
        message: 'Request successful. Please enter M-PESA PIN to complete transaction',
        data: {
          requestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID,
        },
      };
    } catch (error) {
      console.error('STK Push Error:', error.response?.data || error.message);
      throw new HttpException(
        'Payment initiation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleCallback(callbackData: any): Promise<void> {
    try {
      console.log('STK PUSH CALLBACK');
      const stkCallback = callbackData.Body?.stkCallback;
      
      if (!stkCallback) {
        console.error('Invalid callback data structure');
        return;
      }

      const merchantRequestID = stkCallback.MerchantRequestID;
      const checkoutRequestID = stkCallback.CheckoutRequestID;
      const resultCode = stkCallback.ResultCode;
      const resultDesc = stkCallback.ResultDesc;

      console.log('MerchantRequestID:', merchantRequestID);
      console.log('CheckoutRequestID:', checkoutRequestID);
      console.log('ResultCode:', resultCode);
      console.log('ResultDesc:', resultDesc);

      // Update payment status in database
      const payment = await this.prisma.payment.findFirst({
        where: { checkoutRequestId: checkoutRequestID },
      });

      if (payment) {
        if (resultCode === 0) {
          // Payment successful
          const callbackMetadata = stkCallback.CallbackMetadata;
          const amount = callbackMetadata.Item[0].Value;
          const mpesaReceiptNumber = callbackMetadata.Item[1].Value;
          const transactionDate = callbackMetadata.Item[3].Value;
          const phoneNumber = callbackMetadata.Item[4].Value;

          await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              mpesaReceiptNumber,
              transactionDate: new Date(transactionDate),
              resultCode,
              resultDescription: resultDesc,
            },
          });

          console.log('Payment completed successfully');
          console.log('Amount:', amount);
          console.log('MpesaReceiptNumber:', mpesaReceiptNumber);
          console.log('TransactionDate:', transactionDate);
          console.log('PhoneNumber:', phoneNumber);
        } else {
          // Payment failed
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'FAILED',
              resultCode,
              resultDescription: resultDesc,
            },
          });

          console.log('Payment failed:', resultDesc);
        }
      }

      // Store callback data for debugging
      const callbackJson = JSON.stringify(callbackData, null, 2);
      fs.writeFileSync('stkcallback.json', callbackJson);
      console.log('STK PUSH CALLBACK STORED SUCCESSFULLY');
    } catch (error) {
      console.error('Error processing callback:', error);
    }
  }
}