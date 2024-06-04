import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { IslandsComponent } from './modules/games/islands/islands.component';
import { LevelsComponent } from './modules/games/levels/levels.component';
import { ActivitiesComponent } from './modules/games/activities/activities.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.routes')},
    { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.routes')},
    { path: 'games', loadChildren: () => import('./modules/games/games.routes')},
];
