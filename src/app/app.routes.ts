import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { IslandsComponent } from './modules/games/islands/islands.component';
import { LevelsComponent } from './modules/games/levels/levels.component';
import { ActivitiesComponent } from './modules/games/activities/activities.component';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./modules/layout/layout.routes') },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.routes') },
    { path: 'games', component: IslandsComponent},
    { path: 'games/island/:island', component: LevelsComponent },
    { path: 'games/island/:island/:level', component: ActivitiesComponent },
];
