import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Purchase {
  id: string;
  courseTitle: string;
  courseImage: string;
  purchaseDate: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: string;
  instructor: string;
}

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">Purchase History</h1>
            <p class="text-gray-600 mt-1">View all your course purchases and transaction history</p>
          </div>

          <div class="p-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-r from-teal-400 to-teal-500 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-teal-100 text-sm">Total Spent</p>
                    <p class="text-2xl font-bold">$1,247</p>
                  </div>
                  <i class="material-icons text-3xl text-teal-200">attach_money</i>
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-100 text-sm">Courses Purchased</p>
                    <p class="text-2xl font-bold">12</p>
                  </div>
                  <i class="material-icons text-3xl text-blue-200">school</i>
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-100 text-sm">This Month</p>
                    <p class="text-2xl font-bold">$197</p>
                  </div>
                  <i class="material-icons text-3xl text-purple-200">trending_up</i>
                </div>
              </div>
            </div>

            <!-- Purchase List -->
            <div class="space-y-4">
              <div 
                *ngFor="let purchase of purchases" 
                class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start space-x-4">
                  <img 
                    [src]="purchase.courseImage" 
                    [alt]="purchase.courseTitle"
                    class="w-20 h-20 rounded-lg object-cover"
                  />
                  <div class="flex-1">
                    <div class="flex items-start justify-between">
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">{{ purchase.courseTitle }}</h3>
                        <p class="text-sm text-gray-600">by {{ purchase.instructor }}</p>
                        <div class="flex items-center space-x-4 mt-2">
                          <span class="text-sm text-gray-500">{{ purchase.purchaseDate }}</span>
                          <span class="text-sm text-gray-500">{{ purchase.paymentMethod }}</span>
                          <span 
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [class.bg-green-100]="purchase.status === 'completed'"
                            [class.text-green-800]="purchase.status === 'completed'"
                            [class.bg-yellow-100]="purchase.status === 'pending'"
                            [class.text-yellow-800]="purchase.status === 'pending'"
                            [class.bg-red-100]="purchase.status === 'refunded'"
                            [class.text-red-800]="purchase.status === 'refunded'"
                          >
                            {{ purchase.status | titlecase }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-xl font-bold text-gray-900">\${{ purchase.amount }}</p>
                        <div class="flex items-center space-x-2 mt-2">
                          <button 
                            *ngIf="purchase.status === 'completed'"
                            class="text-sm text-teal-600 hover:text-teal-700 font-medium"
                          >
                            View Course
                          </button>
                          <button 
                            class="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Download Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">Showing 1 to 10 of 12 results</span>
              </div>
              <div class="flex items-center space-x-2">
                <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button class="px-3 py-1 bg-teal-400 text-white rounded-md text-sm">
                  1
                </button>
                <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class PurchaseHistory implements OnInit {
  purchases: Purchase[] = [
    {
      id: '1',
      courseTitle: 'Complete React Developer Course',
      courseImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      purchaseDate: 'March 15, 2024',
      amount: 99.99,
      status: 'completed',
      paymentMethod: 'Credit Card',
      instructor: 'John Smith'
    },
    {
      id: '2',
      courseTitle: 'Advanced JavaScript Concepts',
      courseImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80',
      purchaseDate: 'March 10, 2024',
      amount: 79.99,
      status: 'completed',
      paymentMethod: 'PayPal',
      instructor: 'Sarah Johnson'
    },
    {
      id: '3',
      courseTitle: 'Python for Data Science',
      courseImage: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80',
      purchaseDate: 'March 5, 2024',
      amount: 129.99,
      status: 'completed',
      paymentMethod: 'Credit Card',
      instructor: 'Michael Chen'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
