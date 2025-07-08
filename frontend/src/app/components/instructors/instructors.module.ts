import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InstructorsComponent } from './instructors.component';
import { InstructorDetail } from './instructor-detail/instructor-detail';

const routes: Routes = [
  { path: '', component: InstructorsComponent },
  { path: ':id', component: InstructorDetail }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    InstructorsComponent,
    InstructorDetail
  ],
  exports: [RouterModule]
})
export class InstructorsModule { }