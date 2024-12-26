import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';

@Component({
  selector: 'app-game-a-cactus',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-a-cactus.component.html',
  styleUrl: './game-a-cactus.component.css'
})
export class GameACactusComponent {
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  interval: any
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  posCurrentDown = 0
  itemsResources: any[] = []
  allItemsResources = [
    [],
    [
      { id: 0, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 758, top: -16, left: 8 },
      { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 805, top: -31, left: 70 },
      { id: 2, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 916, top: -41, left: 30 },
      { id: 3, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1022, top: -61, left: 67 },
      { id: 4, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1138, top: -81, left: 20 },
      { id: 5, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1287, top: -91, left: 80 },
    ],
    [
      { id: 0, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 758, top: -16, left: 8 },
      { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 805, top: -31, left: 70 },
      { id: 2, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 916, top: -41, left: 30 },
      { id: 3, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1022, top: -61, left: 67 },
      { id: 4, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1138, top: -81, left: 20 },
      { id: 5, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1287, top: -91, left: 80 },
    ],
    [
      { id: 0, completed: false, img: 'assets/images/isla0/burbujas.svg', audio: 'assets/audios/fonema_k.wav', yEnd: 758, top: -16, left: 8 },
      { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 805, top: -31, left: 70 },
      { id: 2, completed: false, img: 'assets/images/isla0/serpiente.png', audio: 'assets/audios/fonema_s.wav', yEnd: 916, top: -41, left: 30 },
      { id: 3, completed: false, img: 'assets/images/isla0/tren.png', audio: 'assets/audios/fonema_ch.wav', yEnd: 1022, top: -61, left: 67 },
      { id: 4, completed: false, img: 'assets/images/isla0/vaca.png', audio: 'assets/audios/fonema_m.wav', yEnd: 1138, top: -81, left: 20 },
      { id: 5, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1287, top: -91, left: 80 },
    ],
  ]


  correctItemsResources: any[] = []
  allCorrectItemsResources = [
    [],
    [
      { completed: false, pos: 0, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 1, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 2, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 3, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 4, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 5, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
    ],
    [
      { completed: false, pos: 0, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 1, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 2, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 3, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 4, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 5, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
    ],
    [
      { completed: false, pos: 1, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
      { completed: false, pos: 5, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
    ],
  ]


  sizeCorrectItems = 0;
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _toastGameService: ToastGameService, public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Cada vez que haces una explosión, el micrófono graba el sonido y el globo crece más. ¡Sigue haciendo explosiones hasta que el globo estalle!',
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
    this.isCompleted = false
    this.itemsResources = this.allItemsResources[this.section]
    this.correctItemsResources = this.allCorrectItemsResources[this.section]
    this.intents = this.correctItemsResources.length
    this.sizeCorrectItems = this.correctItemsResources.length;
  }

  play() {
    setTimeout(() => {
      this.handleClickNextAudio(this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].audio)
    }, 380)
    this.isRuning = true
    let count = 0
    this.interval = setInterval(() => {
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(${count}px)`);
      count = count + 2

      if (count > 1250) {
        clearInterval(this.interval)
        if (this.sizeCorrectItems > 0) {
          /* this.isCompleted = true */
          this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
          this._toastService.toast.set({
            type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
              this._toastService.toast.set(undefined)
              this.restart()
            }
          })
        }
      }

      if (this.posCurrentDown < this.itemsResources.length && count > this.itemsResources[this.posCurrentDown].yEnd) {
        this.itemsResources[this.posCurrentDown].completed = true
        this.posCurrentDown++
      }
    }, 20);
  }

  handleClick(btn: number) {
    this.itemsResources[btn].completed = true    

    if (this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].pos == btn) {
      this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].completed = true
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
      this.restart()
      this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
      setTimeout(() => {
        this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
      }, 700);

      this.isCompleted = true
      this._toastGameService.toast.set({
        type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
          this._toastGameService.toast.set(undefined)
        }
      })
    } else if (this.intents == 0) {
      this.restart()
      this._toastService.toast.set({
        type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
          this._toastService.toast.set(undefined)
        }
      })
    }
  }

  restart() {
    this.isCompleted = false
    clearInterval(this.interval)
    this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
    this.itemsResources.forEach(res => res.completed = false)
    this.correctItemsResources.forEach(res => res.completed = false)
    this.sizeCorrectItems = this.correctItemsResources.length
    this.intents = this.correctItemsResources.length
    this.audio = ''
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
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

