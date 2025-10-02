import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // If user is already logged in, redirect to tasks
    return router.parseUrl('/tasks');
  }

  // If user is not logged in, allow access to the login page
  return true;
};
