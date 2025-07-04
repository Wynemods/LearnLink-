import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="landing-container">
      <h1>Welcome to LearnLink</h1>
      <p>Your gateway to online learning</p>
      <a routerLink="/auth/login" class="btn btn-primary">Get Started</a>
    </div>
  `,
  styles: [`
    .landing-container {
      text-align: center;
      padding: 2rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 4px;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
  `]
})
export class LandingComponent { }