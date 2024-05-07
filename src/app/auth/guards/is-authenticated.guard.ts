import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  
  if (authService.authStatus() === AuthStatus.authenticated) return true;
  if (authService.authStatus() === AuthStatus.checking) return false;
  
  //router.navigateByUrl('/auth/login');
  return false;
};
