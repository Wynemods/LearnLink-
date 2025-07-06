import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  const userRole = authService.getCurrentUser()?.role;

  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    router.navigate(['/']);
    return false;
  }
  
  return true;
};
