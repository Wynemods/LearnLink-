import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuizList } from './quiz-list/quiz-list';
import { QuizForm } from './quiz-form/quiz-form';
import { QuizTake } from './quiz-take/quiz-take';
import { QuizResults } from './quiz-results/quiz-results';

const routes: Routes = [
  { path: '', component: QuizList },
  { path: 'create', component: QuizForm },
  { path: ':id/edit', component: QuizForm },
  { path: ':id/take', component: QuizTake },
  { path: ':id/results', component: QuizResults }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QuizList,
    QuizForm,
    QuizTake,
    QuizResults
  ]
})
export class QuizzesModule { }