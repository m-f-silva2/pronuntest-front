import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { IslandsComponent } from './islands/islands.component';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { GameZzMicrophoneComponent } from './play-layout/components/games/game-zz-microphone/game-zz-microphone.component';

import { GameService } from './play-layout/game.service';
import { GameZzPlayComponent } from './play-layout/components/games/game-zz-play/game-zz-play.component';
import { GameZzMoveboxComponent } from './play-layout/components/games/game-zz-movebox/game-zz-movebox.component';
import { PlayLayoutComponent } from './play-layout/play-layout.component';
import { HomeComponent } from './home/home.component';
import { GameACactusComponent } from './play-layout/components/games/game-a-cactus/game-a-cactus.component';
import { GameBFaceComponent } from './play-layout/components/games/game-b-face/game-b-face.component';
import { GameCTapComponent } from './play-layout/components/games/game-c-tap/game-c-tap.component';
import { GameDInflateComponent } from './play-layout/components/games/game-d-inflate/game-d-inflate.component';
import { GameEMoleComponent } from './play-layout/components/games/game-e-mole/game-e-mole.component';
import { GameFCardsComponent } from './play-layout/components/games/game-f-cards/game-f-cards.component';
import { GameGCloudsComponent } from './play-layout/components/games/game-g-clouds/game-g-clouds.component';
import { GameHSurferComponent } from './play-layout/components/games/game-h-surfer/game-h-surfer.component';
import { GameIListenboxComponent } from './play-layout/components/games/game-i-listenbox/game-i-listenbox.component';
import { GameJPanelComponent } from './play-layout/components/games/game-j-panel/game-j-panel.component';
import { GameKHistoryComponent } from './play-layout/components/games/game-k-history/game-k-history.component';
import { GameLTempComponent } from './play-layout/components/games/game-l-temp/game-l-temp.component';

const gameResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const levelService = inject(GameService);
  const router = inject(Router);
  const params = state.url.split('/')
  const island = params[3]
  const level = params[5]
  const gamePos  = params[7]

  return levelService.getDataGame(Number(island??0), Number(level??1), Number(gamePos??1)).pipe(
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
  
  { path: 'island/0', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/1', component: GameACactusComponent, resolve: {gameResolver} }, ] },
  { path: 'island/0', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/1', component: GameBFaceComponent, resolve: {gameResolver} }, ] },
  { path: 'island/0', component: PlayLayoutComponent, children: [ { path: 'level/3/gamePos/1', component: GameCTapComponent, resolve: {gameResolver} }, ] },
  { path: 'island/0', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/1', component: GameDInflateComponent, resolve: {gameResolver} }, ] },

  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/1', component: GameEMoleComponent, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/1', component: GameFCardsComponent, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/3/gamePos/1', component: GameGCloudsComponent, resolve: {gameResolver} }, ] },
  { path: 'island/1', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/1', component: GameHSurferComponent, resolve: {gameResolver} }, ] },

  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/1', component: GameIListenboxComponent, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/2/gamePos/1', component: GameJPanelComponent, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/3/gamePos/1', component: GameFCardsComponent, resolve: {gameResolver} }, ] },
  { path: 'island/2', component: PlayLayoutComponent, children: [ { path: 'level/4/gamePos/1', component: GameFCardsComponent, resolve: {gameResolver} }, ] },

  { path: 'island/3', component: PlayLayoutComponent, children: [ { path: 'level/1/gamePos/1', component: GameKHistoryComponent, resolve: {gameResolver} }, ] },
  /* 
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