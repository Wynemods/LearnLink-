import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, PaymentResponse } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service'; // Changed from Auth to AuthService

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
export class CheckoutForm implements OnInit {
  selectedPaymentMethod: 'visa' | 'mpesa' = 'mpesa';
  
  // Form data
  cardName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvc: string = '';
  phoneNumber: string = '';
  saveInfo: boolean = false;
  
  // Loading states
  loading = false;
  
  // Order summary data
  orderSummary: OrderSummary = {
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  };

  // Payment status
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed' = 'idle';
  paymentMessage: string = '';
  id: string = '';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    public authService: AuthService // Using AuthService instead of Auth
  ) {}

  ngOnInit() {
    // Get course data from query params first
    this.route.queryParams.subscribe(params => {
      if (params['courseId'] && params['title'] && params['price']) {
        const item: CartItem = {
          id: params['courseId'],
          title: params['title'],
          description: params['description'] || '',
          price: parseFloat(params['price']),
          image: params['image'] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
        };
        
        this.orderSummary.items = [item];
        this.calculateTotals();
      }
    });

    // Check authentication after setting up the course data
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, showing login prompt');
    } else {
      // Set default phone number if user is logged in
      const user = this.authService.getCurrentUser();
      if (user) {
        console.log('User is authenticated:', user);
        // You can pre-populate phone number if it exists in user profile
        this.phoneNumber = user.phoneNumber || '';
      }
    }
  }

  private calculateTotals() {
    this.orderSummary.subtotal = this.orderSummary.items.reduce((sum, item) => sum + item.price, 0);
    this.orderSummary.tax = this.orderSummary.subtotal * 0.05; // 5% tax
    this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.tax - this.orderSummary.discount;
  }

  selectPaymentMethod(method: 'visa' | 'mpesa'): void {
    this.selectedPaymentMethod = method;
    this.resetFormData();
  }

  private resetFormData(): void {
    this.cardName = '';
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvc = '';
    if (!this.authService.currentUser) {
      this.phoneNumber = '';
    }
    this.paymentStatus = 'idle';
    this.paymentMessage = '';
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

  private validateForm(): boolean {
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      this.paymentMessage = 'Please log in to complete your purchase';
      this.paymentStatus = 'failed';
      return false;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.paymentMessage = 'Please log in to complete your purchase';
      this.paymentStatus = 'failed';
      return false;
    }

    if (this.selectedPaymentMethod === 'visa') {
      if (!this.cardName || !this.cardNumber || !this.expiryDate || !this.cvc) {
        this.paymentMessage = 'Please fill in all card details';
        this.paymentStatus = 'failed';
        return false;
      }
      
      if (this.cardNumber.replace(/\s/g, '').length < 16) {
        this.paymentMessage = 'Please enter a valid card number';
        this.paymentStatus = 'failed';
        return false;
      }
    } else if (this.selectedPaymentMethod === 'mpesa') {
      if (!this.phoneNumber) {
        this.paymentMessage = 'Please enter your M-Pesa phone number';
        this.paymentStatus = 'failed';
        return false;
      }
      
      if (!this.paymentService.validatePhoneNumber(this.phoneNumber)) {
        this.paymentMessage = 'Please enter a valid Kenyan phone number';
        this.paymentStatus = 'failed';
        return false;
      }
    }

    this.paymentStatus = 'idle';
    this.paymentMessage = '';
    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      // If validation fails due to authentication, redirect to login
      if (!this.authService.isAuthenticated()) {
        setTimeout(() => {
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: this.router.url } 
          });
        }, 2000);
      }
      return;
    }

    // Proceed with payment for authenticated users
    if (this.selectedPaymentMethod === 'visa') {
      this.processVisaPayment();
    } else {
      this.processMpesaPayment();
    }
  }

  private processVisaPayment(): void {
    this.loading = true;
    this.paymentStatus = 'processing';
    this.paymentMessage = 'Processing card payment...';

    // For testing - always succeed for logged-in users
    setTimeout(() => {
      this.loading = false;
      this.paymentStatus = 'success';
      this.paymentMessage = 'Payment completed successfully! You have been enrolled in the course.';
      
      // Automatically redirect to course after 3 seconds
      setTimeout(() => {
        const courseId = this.orderSummary.items[0]?.id;
        if (courseId) {
          this.router.navigate(['/courses', courseId]);
        }
      }, 3000);
    }, 3000);
  }

  private processMpesaPayment(): void {
    const courseId = this.orderSummary.items[0]?.id;
    const amount = this.orderSummary.total;

    if (!courseId) {
      this.paymentStatus = 'failed';
      this.paymentMessage = 'Course information is missing';
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!this.authService.isAuthenticated() || !currentUser) {
      this.paymentStatus = 'failed';
      this.paymentMessage = 'Please log in to complete your purchase';
      setTimeout(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      }, 2000);
      return;
    }

    this.paymentStatus = 'processing';
    this.paymentMessage = 'Initiating M-Pesa payment...';

    const paymentData = {
      phoneNumber: this.phoneNumber,
      amount: amount,
      courseId: courseId
    };

    this.paymentService.initiatePayment(paymentData).subscribe({
      next: (response: PaymentResponse) => {
        if (response.success || response.status === 'success') {
          this.paymentStatus = 'success';
          this.paymentMessage = response.message;
          // Optionally display merchantRequestId and mpesaReceiptNumber
          // e.g., this.merchantRequestId = response.data?.merchantRequestId;
          // this.mpesaReceiptNumber = response.data?.mpesaReceiptNumber;
          setTimeout(() => {
            this.router.navigate(['/courses', courseId]);
          }, 3000);
        } else {
          this.paymentStatus = 'failed';
          this.paymentMessage = response.message || 'Payment failed';
        }
      },
      error: (error: any) => {
        this.paymentStatus = 'failed';
        this.paymentMessage = error.message || 'Payment failed. Please try again.';
      }
    });
  }

  // Retry payment
  retryPayment(): void {
    this.paymentStatus = 'idle';
    this.paymentMessage = '';
  }

  // Go back to course
  goBackToCourse(): void {
    const courseId = this.orderSummary.items[0]?.id;
    if (courseId) {
      this.router.navigate(['/courses', courseId]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
