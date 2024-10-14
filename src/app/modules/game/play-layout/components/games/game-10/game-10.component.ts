import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-10',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule],
  templateUrl: './game-10.component.html',
  styleUrl: './game-10.component.css'
})
export class Game10Component {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = []
  section = 0
  countRecording = 0
  dataGames: IDataGame
  isCompleted = false
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  audios = ['assets/audios/fonema_d.wav', 'assets/audios/fonema_p.wav', 'assets/audios/fonema_s.wav', 'assets/audios/fonema_ch.wav','assets/audios/fonema_m.wav']
  sounds = [false, false, false, false, false]

  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'VAMOS A ESCUCHAR SONIDOS DE "'+this._gameService.currentGame.phoneme+'"',
      subtitle: undefined,
      resource: '',
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  balloonState: string = 'normal';

  explodeBalloon() {
    this.balloonState = 'exploded';

    // Reproducir sonido de explosión
    const audio = new Audio('assets/audios/fonema_p.wav');
    audio.play();

    // Restablecer el estado tras unos segundos
    setTimeout(() => {
      this.balloonState = 'normal';
    }, 1500); // Volver a mostrar el globo después de 2 segundos
  }

  isPlaying: boolean = true;

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
  }
  
  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }

  handleClick(btn: number){
    this.sounds[btn] = true;
    (document.getElementById('audio'+btn) as HTMLAudioElement).play();
    

    if(this.sounds.every(res=>res===true)){
      this.isCompleted = true
      this._toastService.toast.set({ type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => { 
        this._toastService.toast.set(undefined)
      }})
    }
    if(btn == 1){
      this.togglePlayPause();
    }
  }
}
