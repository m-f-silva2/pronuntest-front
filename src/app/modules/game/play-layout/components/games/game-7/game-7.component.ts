import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-game-7',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent],
  templateUrl: './game-7.component.html',
  styleUrl: './game-7.component.css'
})
export class Game7Component {
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  blockBtn = false
  interval: any
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  countRecording = 0
  dataGames: IDataGame
  isCompleted = false
  audios = [
    'assets/audios/fonema_k.wav',
    'assets/audios/fonema_p.wav',
    'assets/audios/fonema_s.wav',
    'assets/audios/fonema_ch.wav',
    'assets/audios/fonema_m.wav'
  ]
  posCurrentDown = 0
  itemsResources = [
    { id: 0, completed: false, img: 'assets/images/isla0/burbujas.svg', audio: 'assets/audios/fonema_k.wav', yEnd: 558,  top: -16, left: 8 },
    { id: 1, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 605,     top: -31, left: 70 },
    { id: 2, completed: false, img: 'assets/images/isla0/serpiente.png', audio: 'assets/audios/fonema_s.wav', yEnd: 710, top: -41, left: 30 },
    { id: 3, completed: false, img: 'assets/images/isla0/tren.png', audio: 'assets/audios/fonema_ch.wav', yEnd: 810,     top: -61, left: 67 },
    { id: 4, completed: false, img: 'assets/images/isla0/vaca.png', audio: 'assets/audios/fonema_m.wav', yEnd: 915,      top: -81, left: 20 },
    { id: 5, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 1000,      top: -91, left: 80 },
  ]
  correctItemsResources = [
    { completed: false, pos: 1, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
    { completed: false, pos: 5, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/question_mark.svg' },
    /* { completed: false, pos: 4, audio: 'assets/audios/fonema_m.wav', img: 'assets/images/isla0/vaca.png' }, */
  ]
  sizeCorrectItems = this.correctItemsResources.length;
  intents = 2;
  audio: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
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
  }

  animation() {
    this.blockBtn = true
    let count = 0
    this.interval = setInterval(() => {
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(${count}px)`);
      count++
      if (count > 950) {
        clearInterval(this.interval)
        if (this.sizeCorrectItems > 0) {
          /* this.isCompleted = true */
          this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
          this._toastService.toast.set({
            type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
              this._toastService.toast.set(undefined)
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
    this.handleClickNextAudio(this.itemsResources[btn].audio)

    if (this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].pos == btn) {
      this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].completed = true
      this.sizeCorrectItems--
    } else {
      this.intents--
    }

    if (this.sizeCorrectItems == 0 && this.intents > 0) {
      this.restart()
      this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
      this.isCompleted = true
      this._toastService.toast.set({
        type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
          this._toastService.toast.set(undefined)
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
    this.intents = 2
    this.audio = ''
  }

  handleClickNextAudio(_audio: string) {
    this.audio = _audio;
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 10);
  }
}