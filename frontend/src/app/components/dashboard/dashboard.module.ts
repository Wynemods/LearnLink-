import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { InstructorDashboard } from './instructor-dashboard/instructor-dashboard';


const routes: Routes = [
  { path: 'admin', component: AdminDashboard },
  { path: 'instructor', component: InstructorDashboard },
  { path: '', redirectTo: 'student', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminDashboard,
    InstructorDashboard,
  ]
})
export class DashboardModule { }