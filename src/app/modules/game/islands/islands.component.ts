import { Component } from '@angular/core';
import { BtnLevelComponent } from './btn-level.component';
import { Router, RouterLink } from '@angular/router';
import { IDataGame, GameService } from '../play-layout/game.service';
import { Subject, takeUntil } from 'rxjs';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-islands',
  standalone: true,
  imports: [BtnLevelComponent, RouterLink, AngularSvgIconModule],
  templateUrl: './islands.component.html',
  styleUrl: './islands.component.css'
})
export class IslandsComponent {
  btns: { state: 'block'|'unlock', island: number, level?: number }[] = [
    { state:'unlock',island:1,level:1},{state:'block',island:1,level:2},{state:'block',island:1,level:3},{state:'block',island:1,level:4},{state:'block',island:1,level:5},
    { state:'block',island:2,level:1},{state:'block',island:2,level:2},{state:'block',island:2,level:3},{state:'block',island:2,level:4},{state:'block',island:2,level:5},
    { state:'block',island:3,level:1},{state:'block',island:3,level:2},{state:'block',island:3,level:3},{state:'block',island:3,level:4},{state:'block',island:3,level:5},
  ]
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Log out',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '/auth',
    },
  ];
  dataGames: IDataGame
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _route: Router, public _gameService: GameService){
    this.dataGames = this._gameService.dataGames
    this._gameService._islandLevels.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      res?.forEach((item, index) => {
        this.btns[index].state = 'unlock'
      })
      
      /* this.sumaryActivity */
    })
  }

  public logoup(){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  handleBtnLevel(event: { state: 'block'|'unlock', island?: number, level?: number }){
    this._route.navigateByUrl(`/games/island/${event.island}/level/${event.level}/gamePos/1`)
  }
}
