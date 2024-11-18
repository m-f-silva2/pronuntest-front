import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';

@Component({
  selector: 'app-game-c-tap',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-c-tap.component.html',
  styleUrl: './game-c-tap.component.css'
})
export class GameCTapComponent {
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  sizeCorrectItems = 0
  itemsResources: { id: number, completed: boolean, img: string, audio: string, yEnd: number, top: number, left: number }[] = []
  allItemsResources: { id: number, completed: boolean, img: string, audio: string, yEnd: number, top: number, left: number }[][] = [
    [],
    [
      { id: 0, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1138, top: 80, left: 20 },
      { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 916, top: 41, left: 30 },
    ],
    [
      { id: 0, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1287, top: 38, left: 80 },
      { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1138, top: 41, left: 20 },
      { id: 2, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1022, top: 61, left: 67 },
    ],
    [
      { id: 0, completed: false, img: 'assets/images/isla0/tren.png', audio: 'assets/audios/fonema_ch.wav', yEnd: 1022, top: 61, left: 67 },
      { id: 1, completed: false, img: 'assets/images/isla0/serpiente.png', audio: 'assets/audios/fonema_s.wav', yEnd: 916, top: 41, left: 30 },
      { id: 2, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 805, top: 31, left: 70 },
      { id: 3, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 758, top: 16, left: 8 },
    ],
  ]

  correctItemResource?: { id: number, completed: boolean, img: string, audio: string, sizeCorrectItems: number, intents: number }
  allCorrectItemBySection: { id: number, completed: boolean, img: string, audio: string, sizeCorrectItems: number, intents: number }[] = [
    { id: -1, completed: false, img: '', audio: '', sizeCorrectItems: -1, intents: -1 },
    { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', sizeCorrectItems: 2, intents: 2 },
    { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', sizeCorrectItems: 3, intents: 3 },
    { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', sizeCorrectItems: 2, intents: 2 },
  ]


  /* sizeCorrectItems = 0; */
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _toastGameService: ToastGameService, public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Vamos a escuchar sonidos de la letra ' + this._gameService.structure?.phoneme_type + ' \n\nToca las burbujas que más se parezcan al sonido que escuches',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
    this.initData()
  }

  initData() {
    this.itemsResources = this.allItemsResources[this.section]
    this.correctItemResource = this.allCorrectItemBySection[this.section]
    this.isCompleted = false
    this.sizeCorrectItems = this.correctItemResource?.sizeCorrectItems || 0
    this.intents = this.correctItemResource?.intents || 0
    this.audio = ''
    this.itemsResources.forEach(res => res.completed = false)
  }
  play() {
    this.initData()
    this.isRuning = true
    setTimeout(() => {
      this.handleClickNextAudio(this.correctItemResource!.audio)
    }, 380)
  }
  restart() {
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  handleClick(btn: number) {
    this.itemsResources[btn].completed = true;
    if (this.itemsResources[btn].audio == this.correctItemResource?.audio) {
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        this.handleClickNextAudio(this.itemsResources[btn].audio)
        setTimeout(() => {
          this.handleSecondaryAudio(['assets/audios/sonido_excelente.mp3', 'assets/audios/sonido_perfecto.mp3'][Math.floor(Math.random() * 2)])
        }, 100);
      }
    } else {
      this.handleSecondaryAudio('assets/audios/error.mp3')
      this.intents--
    }

    if (this.sizeCorrectItems == 0 && this.intents > 0) {
      
      this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
      setTimeout(() => {
        this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
        this.restart()
        this.isCompleted = true
        this._toastGameService.toast.set({
          type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
            this._toastGameService.toast.set(undefined)
          }
        })
      }, 500);

    } else if (this.intents == 0) {
      this.restart()
      this._toastService.toast.set({
        type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
          this._toastService.toast.set(undefined)
        }
      })
    }
  }

  handleClickNextAudio(_audio: string) {
    this.audio = _audio;
    setTimeout(() => {
      (document.getElementById('audio') as HTMLAudioElement).play();
    }, 4);
  }

  handleSecondaryAudio(_audio: string) {
    this.audioAux = _audio;
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 2);
  }
}

