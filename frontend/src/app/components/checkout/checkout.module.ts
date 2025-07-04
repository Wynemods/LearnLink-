import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Cart } from './cart/cart';
import { CheckoutForm } from './checkout-form/checkout-form';
import { PaymentMethods } from './payment-methods/payment-methods';
import { OrderSummary } from './order-summary/order-summary';
import { PaymentSuccess } from './payment-success/payment-success';

const routes: Routes = [
  { path: '', redirectTo: 'cart', pathMatch: 'full' },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: CheckoutForm },
  { path: 'payment', component: PaymentMethods },
  { path: 'summary', component: OrderSummary },
  { path: 'success', component: PaymentSuccess }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Cart,
    CheckoutForm,
    PaymentMethods,
    OrderSummary,
    PaymentSuccess
  ]
})
export class CheckoutModule { }