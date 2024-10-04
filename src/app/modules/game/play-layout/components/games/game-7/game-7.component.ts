import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-game-7',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-7.component.html',
  styleUrl: './game-7.component.css'
})
export class Game7Component {
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

  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
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

  blockBtn = false
  interval: any
  animation() {
    this.blockBtn = true
    let count = 0
    this.interval = setInterval(() => {
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(${count}px)`);
      count++
      if(count > 1000){
        clearInterval(this.interval)
      }
    }, 20);
  }

  handleClick(btn: number){
    this.sounds[btn] = true;
    (document.getElementById('audio'+btn) as HTMLAudioElement).play();

    if(this.sounds.every(res=>res===true)){
      clearInterval(this.interval)
      this.isCompleted = true
      this._toastService.toast.set({ type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => { 
        this._toastService.toast.set(undefined)
      }})
    }
  }
}
