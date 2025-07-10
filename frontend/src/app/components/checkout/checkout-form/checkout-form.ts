import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, PaymentResponse } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';

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

export interface FeaturedCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
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

  // Featured courses data
  featuredCourses: FeaturedCourse[] = [
    {
      id: '1',
      title: 'Complete React Development Course',
      description: 'Master React from basics to advanced concepts',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      discount: '50'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Learn data analysis and machine learning with Python',
      image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=300&fit=crop',
      discount: '40'
    },
    {
      id: '3',
      title: 'UI/UX Design Masterclass',
      description: 'Create stunning user interfaces and experiences',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      discount: '60'
    }
  ];

  // Payment status
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed' = 'idle';
  paymentMessage: string = '';
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    public authService: AuthService,
    private courseService: CourseService
  ) { }

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
        this.phoneNumber = user.phoneNumber || '';
      }
    }
  }

  private calculateTotals() {
    this.orderSummary.subtotal = this.orderSummary.items.reduce((sum, item) => sum + item.price, 0);
    this.orderSummary.tax = this.orderSummary.subtotal * 0.05;
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
    if (!this.authService.getCurrentUser()) {
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
      this.paymentMessage = 'Visa payment is currently unavailable. Please use M-Pesa.';
      this.paymentStatus = 'failed';
      return false;
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

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      if (!this.authService.isAuthenticated()) {
        setTimeout(() => {
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }, 2000);
      }
      return;
    }

    // Directly enroll in course (no payment)
    await this.directEnroll();
  }

  private async directEnroll(): Promise<void> {
    const courseId = this.orderSummary.items[0]?.id;
    if (!courseId) {
      this.paymentStatus = 'failed';
      this.paymentMessage = 'Course information is missing';
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!this.authService.isAuthenticated() || !currentUser) {
      this.paymentStatus = 'failed';
      this.paymentMessage = 'Please log in to enroll in this course';
      setTimeout(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      }, 2000);
      return;
    }
    this.loading = true;
    this.paymentStatus = 'processing';
    this.paymentMessage = 'Enrolling you in the course...';
    try {
      await this.courseService.enrollInCourse(courseId).toPromise();
      this.loading = false;
      this.paymentStatus = 'success';
      this.paymentMessage = 'You have been successfully enrolled in the course!';
      setTimeout(() => {
        this.goBackToCourse();
      }, 2000);
    } catch (err) {
      this.loading = false;
      this.paymentStatus = 'failed';
      this.paymentMessage = 'Enrollment failed. Please try again.';
    }
  }

  retryPayment(): void {
    this.paymentStatus = 'idle';
    this.paymentMessage = '';
    this.loading = false;
  }

  goBackToCourse(): void {
    const courseId = this.orderSummary.items[0]?.id;
    if (courseId) {
      this.router.navigate(['/learn/course', courseId, 'lesson', '1']);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
