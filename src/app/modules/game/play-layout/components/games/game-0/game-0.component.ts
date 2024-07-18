import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { Router } from '@angular/router';
import { IDataGame, LevelService } from '../../../levels.service';

@Component({
  selector: 'app-game-0',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-0.component.html',
  styleUrl: './game-0.component.css'
})
export class Game0Component {
  levelStructure: LevelStructure | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections = [{
    title: 'VAMOS A ESCUCHAR SONIDOS DE LA LETRA P',
    subtitle: 'El sonido de la letra p es igual cuando escuchamos reventar un globo',
    image: 'string',
    next: '1',
    previous: undefined
  }]
  dataGames: IDataGame
  section = 0
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement> | undefined;

  
  constructor(private _levelService: LevelService, private router: Router){
    this.dataGames = this._levelService.dataGames
  
    this._levelService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }
  
  btnsEvent(event: { value?: string | undefined; type: 'endNext'|'firstPrevious'|'previous'|'next'; }) {
    if(event.type === 'endNext'){
      console.log('>> game-0.component >> :', 1)
      this._levelService.navegationGame(1, event.type)
    }else if(event.type === 'firstPrevious'){
      this._levelService.navegationGame(-1, event.type)
    }else if(event.type === 'previous'){
      this.section--
      this._levelService.navegationGame(-1, event.type)
    }else if(event.type === 'next'){
      this._levelService.navegationGame(1, event.type)
      this.section++
    }
  }

  handlePlay(){
    this.audio?.nativeElement.play()
  }
}
