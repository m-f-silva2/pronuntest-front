import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { Router } from '@angular/router';
import { IDataGame, GameService } from '../../../game.service';


@Component({
  selector: 'app-game-0',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-0.component.html',
  styleUrl: './game-0.component.css'
})
export class Game0Component {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = []

  dataGames: IDataGame
  section = 0
  isCompleted = false
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement> | undefined;
  phonemeSrc = ''
  
  constructor(public _gameService: GameService, private router: Router){
    this.dataGames = this._gameService.dataGames
  
    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity= res
    })


    this.phonemeSrc = '/assets/audios/fonema_'+this._gameService.structure?.phoneme+'.mp3'
    console.log('>> >>  :', this.phonemeSrc);



    this.sections.push({
      title: 'VAMOS A RECONOCER EL SONIDOS DE LA LETRA "'+this._gameService.structure?.phoneme_type+'"',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })
    this.sections.push({
      title: 'VAMOS A PRONUNCIAR SONIDOS DE LA LETRA "'+this._gameService.structure?.phoneme+'"',
      subtitle: undefined,
      resource: '',
      next: '1',
      previous: undefined
    })
  }
  
  btnsNavegation(typeDirection: 'endNext'|'firstPrevious'|'previous'|'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next')? 1:-1
    if((this.isCompleted && typeDirection === 'endNext') || typeDirection === 'next'){
      this._gameService.navegationGame(direction, typeDirection)
      this.section += direction
    }
  }
  
  handlePlay(){
    this.audio?.nativeElement.play()
    this.isCompleted = true
  }
}
