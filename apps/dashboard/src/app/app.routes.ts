import { Route } from '@angular/router';
import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';
import { homeGuard } from './home.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks.component').then((m) => m.TasksComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    canActivate: [homeGuard],
    // A component is required for a route with canActivate,
    // but it will never be displayed because the guard always redirects.
    // We point to LoginComponent as a placeholder.
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Catch-all redirect
];
