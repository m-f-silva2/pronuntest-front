import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { IslandsComponent } from './islands/islands.component';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Game1Component } from './play-layout/components/games/game-1/game-1.component';
import { Game2Component } from './play-layout/components/games/game-2/game-2.component';
import { LevelsComponent } from './play-layout/levels.component';
import { LevelService } from './play-layout/levels.service';
import { Game0Component } from './play-layout/components/games/game-0/game-0.component';
import { Game3Component } from './play-layout/components/games/game-3/game-3.component';
import { Game4Component } from './play-layout/components/games/game-4/game-4.component';
import { Game5Component } from './play-layout/components/games/game-5/game-5.component';

const gameResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const levelService = inject(LevelService);
  const router = inject(Router);
  const params = state.url.split('/')
  const island = params[3]
  const level = params[5]

  return levelService.getDataGame(Number(island), level).pipe(
      // Error here means the requested contact is not available
      catchError((error) => {
          // Log the error
          console.error(error);

          // Get the parent url
          const parentUrl = state.url.split('/').slice(0, -1).join('/');

          // Navigate to there
          router.navigateByUrl(parentUrl);

          // Throw an error
          return throwError(error);
      }),
  );
};

export default [
  { path: 'island', component: IslandsComponent },
  
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/1/game/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/1/game/2', component: Game1Component, resolve: {gameResolver} }, ] },

  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/2/game/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/2/game/3', component: Game2Component, resolve: {gameResolver} }, ] },

  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/3/game/4', component: Game3Component, resolve: {gameResolver} }, ] },
  
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/4/game/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/4/game/5', component: Game4Component, resolve: {gameResolver} }, ] },

  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/5/game/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/5/game/2', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/5/game/6', component: Game5Component, resolve: {gameResolver} }, ] },
  
  /* { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/1/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/2/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/3/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/4/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/5/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/1/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/2/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/3/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/4/game/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/5/game/', component: Game1Component, resolve: {gameResolver} }, ] },
 */

  { path: '**', component: IslandsComponent },
] as Routes;