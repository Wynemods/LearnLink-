import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { InstructorDashboard } from './instructor-dashboard/instructor-dashboard';
import { StudentDashboard } from './student-dashboard/student-dashboard';


const routes: Routes = [
  { path: 'admin', component: AdminDashboard },
  { path: 'instructor', component: InstructorDashboard },
  { path: 'student', component: StudentDashboard },
  { path: '', redirectTo: 'student', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Import standalone components instead of declaring them
    AdminDashboard,
    InstructorDashboard,
    StudentDashboard,
  ]
})
export class DashboardModule { }