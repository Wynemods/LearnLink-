import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LessonDashboard } from './lesson-dashboard/lesson-dashboard';
import { Quiz } from './quiz/quiz';

const routes: Routes = [
  { path: 'course/:courseId/lesson/:lessonId', component: LessonDashboard },
  { path: 'course/:courseId/quiz/:quizId', component: Quiz },
  { path: '', redirectTo: '/courses', pathMatch: 'full' }
];
 
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LessonDashboard,
    Quiz
  ]
})
export class LearningModule { }