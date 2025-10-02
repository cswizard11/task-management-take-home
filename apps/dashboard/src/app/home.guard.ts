import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const homeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // If user is logged in, redirect to the tasks page
    return router.parseUrl('/tasks');
  } else {
    // If user is not logged in, redirect to the login page
    return router.parseUrl('/login');
  }
};
