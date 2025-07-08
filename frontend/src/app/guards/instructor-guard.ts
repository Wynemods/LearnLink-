import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.currentUser;
     
    if (user && user.role === 'INSTRUCTOR') {
      return true;
    }
    
    // Redirect to regular dashboard if not an instructor
    this.router.navigate(['/dashboard']);
    return false;
  }
}