import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileView } from './profile-view/profile-view';
import { ProfileEdit } from './profile-edit/profile-edit';
import { PurchaseHistory } from './purchase-history/purchase-history';

const routes: Routes = [
  { path: '', component: ProfileView },
  { path: 'edit', component: ProfileEdit },
  { path: 'purchase-history', component: PurchaseHistory },
  { path: 'certificates', component: ProfileView } // Placeholder for certificates
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }