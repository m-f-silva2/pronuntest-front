import { Routes } from '@angular/router';
import { IslandsComponent } from './modules/games/islands/islands.component';
import { LevelsComponent } from './modules/games/levels/levels.component';

import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./modules/layout/layout.routes'), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.routes') },
    { path: 'games', component: IslandsComponent, canActivate: [AuthGuard]},
    //{ path: 'games/island/:island', component: LevelsComponent, canActivate: [AuthGuard] },
    { path: 'games/island/:island/:level', component: LevelsComponent, canActivate: [AuthGuard] },
];
