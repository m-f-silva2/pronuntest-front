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
  selector: 'app-game-g-clouds',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-g-clouds.component.html',
  styleUrl: './game-g-clouds.component.css'
})
export class GameGCloudsComponent {
  /* Nubes saltos */
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  autoplay = false
  interval: any
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  posCurrentDown = 0
  sectionsGame = 2

  itemsResources: {id: number, isCorrect: boolean, completed: boolean, img: string, audio: string, yEnd: number, top: number, left: number }[] = []
  allItemsResources: {id: number, isCorrect: boolean, completed: boolean, img: string, audio: string, yEnd: number, top: number, left: number }[][] = [
    [],
    [
      { id: 0, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 758, top: -16, left: 8 },
      { id: 1, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 805, top: -31, left: 70 },
      { id: 2, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 916, top: -41, left: 30 },
      { id: 3, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1022, top: -61, left: 67 },
      { id: 4, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1138, top: -81, left: 20 },
      { id: 5, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1287, top: -91, left: 65 },
    ],
    [
      { id: 0, isCorrect: false, completed: false, img: 'assets/images/isla0/burbujas.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 758, top: -16, left: 8 },
      { id: 1, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 805, top: -31, left: 70 },
      { id: 2, isCorrect: false, completed: false, img: 'assets/images/isla0/serpiente.png', audio: 'assets/audios/fonema_p.wav', yEnd: 916, top: -41, left: 30 },
      { id: 3, isCorrect: false, completed: false, img: 'assets/images/isla0/tren.png', audio: 'assets/audios/fonema_p.wav', yEnd: 1022, top: -61, left: 67 },
      { id: 4, isCorrect: false, completed: false, img: 'assets/images/isla0/vaca.png', audio: 'assets/audios/fonema_p.wav', yEnd: 1138, top: -81, left: 20 },
      { id: 5, isCorrect: true, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1287, top: -91, left: 65 },
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
      title: 'Pronuncia las silabas para que el globo salte a la siguiente nube.',
      subtitle: undefined,
      resource: "https://www.youtube.com/embed/dWMg6GeC304?si=d1uZLLqaYBUVKpgn&amp;start=0&autoplay=1",
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
    this.itemsResources = [...this.allItemsResources[this.section]]
    this.intents = this.itemsResources?.length
    this.sizeCorrectItems = this.itemsResources?.filter(res=>res.isCorrect).length;
  }

  play() {
    setTimeout(() => {
      this.handleClickNextAudio(this.itemsResources[this.itemsResources.length - this.sizeCorrectItems].audio)
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
    /* this.itemsResources[btn].completed = true     */

    if (this.itemsResources[btn].isCorrect) {
      this.itemsResources[btn].completed = true
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
    this.autoplay = false;
    this.isCompleted = false
    clearInterval(this.interval)
    this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
    this.itemsResources.forEach(res => res.completed = false)
    this.itemsResources.forEach(res => res.completed = false)
    this.sizeCorrectItems = this.itemsResources.filter(res => res.isCorrect).length
    this.intents = this.itemsResources.length
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

