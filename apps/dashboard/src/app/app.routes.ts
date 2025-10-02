import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from './auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks.component').then((m) => m.TasksComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    component: HomeComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Catch-all redirect
];
