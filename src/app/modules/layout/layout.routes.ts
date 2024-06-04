import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export default [
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
] as Routes;