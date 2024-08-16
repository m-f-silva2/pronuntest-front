import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { IslandsComponent } from './islands/islands.component';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { Game1Component } from './play-layout/components/games/game-1/game-1.component';
import { Game2Component } from './play-layout/components/games/game-2/game-2.component';

import { GameService } from './play-layout/game.service';
import { Game0Component } from './play-layout/components/games/game-0/game-0.component';
import { Game3Component } from './play-layout/components/games/game-3/game-3.component';
import { Game4Component } from './play-layout/components/games/game-4/game-4.component';
import { Game5Component } from './play-layout/components/games/game-5/game-5.component';
import { PlayLayoutComponent } from './play-layout/play-layout.component';
import { HomeComponent } from './home/home.component';

const gameResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const levelService = inject(GameService);
  const router = inject(Router);
  const params = state.url.split('/')
  const island = params[3]
  const level = params[5]
  const gamePos  = params[7]

  return levelService.getDataGame(Number(island??1), Number(level??1), Number(gamePos??1)).pipe(
      catchError((error) => {
          console.error(error);
          const parentUrl = state.url.split('/').slice(0, -1).join('/');
          router.navigateByUrl(parentUrl);
          throw new Error(error);
      }),
  );
};

export default [
  { path: '', component: HomeComponent },
  { path: 'island', component: IslandsComponent, resolve: {gameResolver} },
  
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/2', component: Game1Component, resolve: {gameResolver} }, ] },

  //{ path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/1', component: Game2Component, resolve: {gameResolver} }, ] },

  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/3/gamePos/1', component: Game3Component, resolve: {gameResolver} }, ] },
  
  //{ path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/1', component: Game4Component, resolve: {gameResolver} }, ] },

  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/5/gamePos/1', component: Game0Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/5/gamePos/2', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/5/gamePos/3', component: Game5Component, resolve: {gameResolver} }, ] },
  
  /* { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/3/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/5/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  
  { path: 'island/3', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: PlayLayoutComponent, children: [ { path: 'level/3/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
  { path: 'island/3', component: PlayLayoutComponent, children: [ { path: 'level/5/gamePos/', component: Game1Component, resolve: {gameResolver} }, ] },
 */

  { path: '**', component: IslandsComponent },
] as Routes;