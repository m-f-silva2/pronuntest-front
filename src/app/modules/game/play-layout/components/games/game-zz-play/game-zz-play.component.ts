import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { Router } from '@angular/router';
import { IDataGame, GameService } from '../../../game.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';


@Component({
  selector: 'app-game-zz-play',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent],
  templateUrl: './game-zz-play.component.html',
  styleUrl: './game-zz-play.component.css'
})
export class GameZzPlayComponent {
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

    this.sections.push({
      title: 'VAMOS A RECONOCER EL SONIDO DE LA LETRA "'+this._gameService.structure?.phoneme_type+'"',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })
    this.sections.push({
      title: 'Vamos a escuchar sonidos relacionados con el fonema "'+this._gameService.structure?.phoneme_type+'", por ejemplo "'+this._gameService.structure?.phoneme+'"',
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
