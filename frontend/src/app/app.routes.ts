import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Landing },
  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [authGuard],
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./components/courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'learn',
    loadChildren: () =>
      import('./components/learning/learning.module').then((m) => m.LearningModule),
    canActivate: [authGuard],
  },
  {
    path: 'live-sessions',
    loadChildren: () =>
      import('./components/live-sessions/live-session.module').then((m) => m.LiveSessionModule),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./components/checkout/checkout.module').then((m) => m.CheckoutModule),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./components/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [authGuard],
  },
  {
    path: 'instructors',
    loadComponent: () =>
      import('./components/instructors/instructors.component').then((m) => m.InstructorsComponent),
  },
  {
    path: 'instructors/:id',
    loadComponent: () =>
      import('./components/instructors/instructor-detail/instructor-detail').then((m) => m.InstructorDetail),
  },
  {
    path: 'community',
    loadComponent: () =>
      import('./components/community/community.component').then((m) => m.CommunityComponent),
  },
  { path: '**', redirectTo: '' }
];
