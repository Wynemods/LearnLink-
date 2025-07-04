import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/shared/navbar/navbar';
import { FooterComponent } from './components/shared/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkNavbarVisibility(event.url);
      });
  }

  private checkNavbarVisibility(url: string): void {
    const hideNavbarRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/reset-password',
      '/dashboard/admin',
      '/dashboard/instructor',
      '/dashboard/student',
      '/learn', // Hide navbar for learning interface
      '/live-sessions' // Hide navbar for live sessions
    ];

    this.showNavbar = !hideNavbarRoutes.some(route => url.startsWith(route));
  }
}
