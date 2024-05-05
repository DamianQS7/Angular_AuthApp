import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public authCheckCompleted = computed<boolean>( () => {

    if (this.authService.authStatus() === AuthStatus.checking) return false;

    return true;
  });

  public authStatusChangedEffect = effect(() => {

    switch(this.authService.authStatus()) {

      case AuthStatus.checking:
        break;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        break;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        break;
    }
  });
}
