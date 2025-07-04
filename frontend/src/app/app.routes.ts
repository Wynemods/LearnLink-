import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./components/courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'quizzes',
    loadChildren: () =>
      import('./components/quizzes/quizzes.module').then((m) => m.QuizzesModule),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./components/checkout/checkout.module').then((m) => m.CheckoutModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./components/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
];
