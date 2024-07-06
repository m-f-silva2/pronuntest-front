import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./modules/layout/layout.routes'), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.routes') },
    { path: 'games', loadChildren: () => import('./modules/games/games.routes'), canActivate: [AuthGuard] },
    
];
