import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';

export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-form.html',
  styleUrls: ['./checkout-form.css']
})
export class CheckoutForm {
  // Payment method types
  selectedPaymentMethod: 'visa' | 'mpesa' = 'visa';
  
  // Form data
  cardName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvc: string = '';
  phoneNumber: string = '';
  saveInfo: boolean = false;
  
  // Order summary data
  orderSummary: OrderSummary = {
    items: [
      {
        id: '1',
        title: 'Advanced JavaScript Course',
        description: 'Learn modern JavaScript fundamentals',
        price: 24.69,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'React Development Masterclass',
        description: 'Master React from basics to advanced',
        price: 24.69,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
      }
    ],
    subtotal: 51.38,
    discount: 0,
    tax: 5,
    total: 56.38
  };

  // Featured courses
  featuredCourses = [
    {
      id: '1',
      title: 'Full Stack Development',
      description: 'Learn complete web development from frontend to backend',
      discount: 50,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'
    },
    {
      id: '2',
      title: 'Data Science Fundamentals',
      description: 'Master data analysis and machine learning basics',
      discount: 10,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
    },
    {
      id: '3',
      title: 'Mobile App Development',
      description: 'Build native mobile applications for iOS and Android',
      discount: 30,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop'
    }
  ];

  constructor(private paymentService: PaymentService) {}

  selectPaymentMethod(method: 'visa' | 'mpesa'): void {
    this.selectedPaymentMethod = method;
    // Clear form data when switching payment methods
    this.resetFormData();
  }

  private resetFormData(): void {
    this.cardName = '';
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvc = '';
    this.phoneNumber = '';
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    // Format as +254 XXX XXX XXX
    if (value.startsWith('254')) {
      value = '+' + value;
    } else if (value.startsWith('0')) {
      value = '+254' + value.substring(1);
    } else if (!value.startsWith('+254')) {
      value = '+254' + value;
    }
    this.phoneNumber = value;
  }

  onSubmit(): void {
    if (this.selectedPaymentMethod === 'visa') {
      this.processVisaPayment();
    } else {
      this.processMpesaPayment();
    }
  }

  private processVisaPayment(): void {
    console.log('Processing Visa payment...', {
      cardName: this.cardName,
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      cvc: this.cvc,
      saveInfo: this.saveInfo
    });
    // Implement Visa payment processing logic
  }

  private processMpesaPayment(): void {
    if (!this.phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    console.log('Processing M-Pesa payment...', {
      phoneNumber: this.phoneNumber,
      amount: this.orderSummary.total
    });

    const paymentData = {
      phoneNumber: this.phoneNumber,
      amount: this.orderSummary.total,
      accountNumber: 'COURSE001'
    };

    this.paymentService.initiateMpesaPayment(paymentData).subscribe({
      next: (response) => {
        console.log('Payment initiated:', response);
        if (response.success && response.data?.requestId) {
          this.checkPaymentStatus(response.data.requestId);
        } else {
          alert('Payment initiation failed: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Payment error:', error);
        alert('Payment failed: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  private checkPaymentStatus(checkoutRequestId: string): void {
    // You can implement a polling mechanism or WebSocket to check payment status
    setTimeout(() => {
      this.paymentService.checkPaymentStatus(checkoutRequestId).subscribe({
        next: (status) => {
          if (status.status === 'COMPLETED') {
            alert('Payment successful!');
            // Redirect to success page
          } else if (status.status === 'FAILED') {
            alert('Payment failed. Please try again.');
          } else {
            // Continue polling if still pending
            this.checkPaymentStatus(checkoutRequestId);
          }
        },
        error: (error) => {
          console.error('Status check error:', error);
        }
      });
    }, 5000); // Check every 5 seconds
  }
}
