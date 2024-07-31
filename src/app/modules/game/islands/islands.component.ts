import { Component } from '@angular/core';
import { BtnLevelComponent } from './btn-level.component';
import { Router, RouterLink } from '@angular/router';
import { IDataGame, GameService } from '../play-layout/game.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-islands',
  standalone: true,
  imports: [BtnLevelComponent, RouterLink],
  templateUrl: './islands.component.html',
  styleUrl: './islands.component.css'
})
export class IslandsComponent {
  btns: { state: 'block'|'unlock', island: number, level?: number }[] = [
    { state:'unlock',island:1,level:1},{state:'block',island:1,level:2},{state:'block',island:1,level:3},{state:'block',island:1,level:4},{state:'block',island:1,level:5},
    { state:'block',island:2,level:1},{state:'block',island:2,level:2},{state:'block',island:2,level:3},{state:'block',island:2,level:4},{state:'block',island:2,level:5},
    { state:'block',island:3,level:1},{state:'block',island:3,level:2},{state:'block',island:3,level:3},{state:'block',island:3,level:4},{state:'block',island:3,level:5},
  ]
  dataGames: IDataGame
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _route: Router, public _gameService: GameService){
    this.dataGames = this._gameService.dataGames
    this._gameService.sumaryActivities$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      res?.forEach(item => {
        
      })
      
      /* this.sumaryActivity */
    })
  }

  handleBtnLevel(event: { state: 'block'|'unlock', island?: number, level?: number }){
    this._route.navigateByUrl(`/games/island/${event.island}/level/${event.level}/gamePos/1`)
  }
}
