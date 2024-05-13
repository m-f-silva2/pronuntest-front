import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { IslandsComponent } from './modules/games/islands/islands.component';
import { LevelsComponent } from './modules/games/levels/levels.component';
import { ActivitiesComponent } from './modules/games/activities/activities.component';

export const routes: Routes = [
    { path: '', component: AuthComponent},
    { path: 'auth', component: AuthComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'games', component: IslandsComponent},
    { path: 'games/island/:island', component: LevelsComponent },
    { path: 'games/island/:island/:level', component: ActivitiesComponent },
];
