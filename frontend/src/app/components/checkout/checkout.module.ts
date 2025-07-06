import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutForm } from './checkout-form/checkout-form';
import { OrderSummary } from './order-summary/order-summary';


const routes: Routes = [
  { path: '', component: CheckoutForm },
  { path: 'summary', component: OrderSummary },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CheckoutForm,
    OrderSummary,
  ]
})
export class CheckoutModule { }