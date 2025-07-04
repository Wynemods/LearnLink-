import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CourseList } from './course-list/course-list';
import { CourseDetail } from './course-detail/course-detail';
import { CourseForm } from './course-form/course-form';
import { LessonViewer } from './lesson-viewer/lesson-viewer';

const routes: Routes = [
  { path: '', component: CourseList },
  { path: 'create', component: CourseForm },
  { path: ':id', component: CourseDetail },
  { path: ':id/edit', component: CourseForm },
  { path: ':id/lesson/:lessonId', component: LessonViewer }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CourseList,
    CourseDetail,
    CourseForm,
    LessonViewer
  ]
})
export class CoursesModule { }