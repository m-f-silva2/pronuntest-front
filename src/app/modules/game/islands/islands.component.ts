import { Component, ElementRef, ViewChild } from '@angular/core';
import { BtnLevelComponent } from './btn-level.component';
import { Router, RouterLink } from '@angular/router';
import { IDataGame, GameService } from '../play-layout/game.service';
import { Subject, takeUntil } from 'rxjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-islands',
  standalone: true,
  imports: [BtnLevelComponent, RouterLink, AngularSvgIconModule, BtnImgComponent],
  templateUrl: './islands.component.html',
  styleUrl: './islands.component.css'
})
export class IslandsComponent {
  @ViewChild('scrollableElement') scrollableElement!: ElementRef;
  btns: { state: 'block'|'unlock', island: number, level?: number }[] = [
    { state:'unlock',island:0,level:1},{state:'block',island:0,level:2},{state:'block',island:0,level:3},{state:'block',island:0,level:4},
    { state:'block',island:1,level:1},{state:'block',island:1,level:2},{state:'block',island:1,level:3},{state:'block',island:1,level:4},
    { state:'block',island:2,level:1},{state:'block',island:2,level:2},{state:'block',island:2,level:3},{state:'block',island:2,level:4},
    { state:'block',island:3,level:1},{state:'block',island:3,level:2},{state:'block',island:3,level:3},{state:'block',island:3,level:4},
  ]
  isOpen = false;
  dataGames: IDataGame
  islad: string = 'Isla 0'
  posIslad: number = 0
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  
  constructor(private _route: Router, public _gameService: GameService){
    this.dataGames = this._gameService.dataGames
    /* FIXME bloquear niveles */
    
    let previousBtn: { state: 'block'|'unlock', island: number, level?: number }
    this._gameService._islandLevels.pipe(takeUntil(this._unsubscribeAll)).subscribe(resIL => {
      for (const btn of this.btns) {
        const resIslandFull = resIL?.find(resIslandFull=>resIslandFull.code_pos_level ==  btn.level && resIslandFull.code_island ==  btn.island)
        if(resIslandFull){
          btn.state = 'unlock'
        }
        if(btn.state == 'block' && previousBtn.state == 'unlock' && (btn.island > previousBtn.island)){
          btn.state = 'unlock'
        }
        previousBtn = btn
      }
    })
  }
  
  ngAfterViewInit () {
    const isladLocal = localStorage.getItem('postIsland')
    if(isladLocal != null){
      this.posIslad = Number(isladLocal)
    }else{
      localStorage.setItem('postIsland', '0')
    }
    
    this.scrollIsland(this.posIslad)
  }

  onScroll() {
    const w = this.scrollableElement.nativeElement.getBoundingClientRect().width
    const left = this.scrollableElement.nativeElement.scrollLeft;
    const pos = Math.round(left/w)
    const _islad = ['Isla 0', 'Isla 1', 'Isla 2', 'Isla 3'][pos]
    if(this.islad != _islad){
      this.islad = _islad
      localStorage.setItem('postIsland', pos.toString())
    }
  }
  async scrollIsland(direction: number){
    const w = this.scrollableElement.nativeElement.getBoundingClientRect().width
    const left = this.scrollableElement.nativeElement.scrollLeft;
    const pos = Math.round(left/w) + direction
    for (let i = left; direction>0? i < (pos*w) : i > (pos*w); i= direction>0? i+30 : i-30) {
      await this.sleep(2)
      this.scrollableElement.nativeElement.scrollLeft = i
    }
  }

  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


  public logoup(){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  handleBtnLevel(event: { state: 'block'|'unlock', island?: number, level?: number }){
    this._route.navigateByUrl(`/games/island/${event.island}/level/${event.level}/gamePos/1`)
  }
}
