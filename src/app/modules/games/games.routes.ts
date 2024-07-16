import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { IslandsComponent } from './islands/islands.component';
import { LevelsComponent } from './levels/levels.component';
import { Game1Component } from './components/level/game-1/game-1.component';
import { LevelService } from './levels/levels.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Game2Component } from './components/level/game-2/game-2.component';

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
  
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/1', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/2', component: Game2Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/3', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/4', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: LevelsComponent, children: [ { path: 'level/5', component: Game1Component, resolve: {gameResolver} }, ] },
  
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/1', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/2', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/3', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/4', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: LevelsComponent, children: [ { path: 'level/5', component: Game1Component, resolve: {gameResolver} }, ] },
  
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/1', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/2', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/3', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/4', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: LevelsComponent, children: [ { path: 'level/5', component: Game1Component, resolve: {gameResolver} }, ] },


  { path: '**', component: IslandsComponent },
] as Routes;