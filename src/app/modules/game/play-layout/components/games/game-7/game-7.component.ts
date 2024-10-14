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
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = []
  section = 0
  countRecording = 0
  dataGames: IDataGame
  isCompleted = false
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  audios = [
    'assets/audios/fonema_k.wav',
    'assets/audios/fonema_p.wav',
    'assets/audios/fonema_s.wav',
    'assets/audios/fonema_ch.wav',
    'assets/audios/fonema_m.wav'
  ]
  /* itemsCompleted = [false, false, false, false, false]
  yItemsEnd      = [558, 605, 710, 810, 915] */
  posCurrentDown = 0
  /* correctItems = [false, true, false, true, true]  */
  itemsResources = [
    { completed: false, img: 'assets/images/isla0/burbujas.svg', audio: 'assets/audios/fonema_k.wav',  yEnd: 558, top: '15%', left: '8%' },
    { completed: false, img: 'assets/images/isla0/globo.png',    audio: 'assets/audios/fonema_p.wav',  yEnd: 605, top: '30%', left: '70%' },
    { completed: false, img: 'assets/images/isla0/serpiente.png',audio: 'assets/audios/fonema_s.wav',  yEnd: 710, top: '40%', left: '30%' },
    { completed: false, img: 'assets/images/isla0/tren.png',     audio: 'assets/audios/fonema_ch.wav', yEnd: 810, top: '60%', left: '67%' },
    { completed: false, img: 'assets/images/isla0/vaca.png',     audio: 'assets/audios/fonema_m.wav',  yEnd: 915, top: '80%', left: '20%' },
  ]
  correctItemsResources = [
    { completed: false, pos: 1, audio: 'assets/audios/fonema_s.wav', img: 'assets/images/isla0/globo.png' },
    { completed: false, pos: 3, audio: 'assets/audios/fonema_p.wav', img: 'assets/images/isla0/tren.png' },
    /* { completed: false, pos: 4, audio: 'assets/audios/fonema_m.wav', img: 'assets/images/isla0/vaca.png' }, */
  ]
  sizeCorrectItems = 2
  intents = 2
  audio: string = ''

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

  blockBtn = false
  interval: any
  animation() {
    this.blockBtn = true
    let count = 0
    this.interval = setInterval(() => {
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(${count}px)`);
      count++
      if (count > 950) {
        clearInterval(this.interval)
        if (this.sizeCorrectItems > 0) {
          this.isCompleted = true
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
    /* this.itemsCompleted[btn] = true; */
    this.handleClickNextAudio(this.itemsResources[btn].audio)

    if (this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].pos == btn) {
      this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].completed = true
      this.sizeCorrectItems--
    } else {
      this.intents--
    }

    if (this.sizeCorrectItems == 0 && this.intents > 0) {
      clearInterval(this.interval)
      this.isCompleted = true
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
      this._toastService.toast.set({
        type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
          this._toastService.toast.set(undefined)
        }
      })
    } else if (this.intents == 0) {
      clearInterval(this.interval)
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
      this._toastService.toast.set({
        type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
          this._toastService.toast.set(undefined)
        }
      })
    }
  }

  restart(){
    this.isCompleted = false
    clearInterval(this.interval)
    this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`); 
    this.itemsResources.forEach(res=>res.completed=false)
    this.correctItemsResources.forEach(res=>res.completed=false)
  }

  handleClickNextAudio(_audio: string) {
    this.audio = _audio;
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 10);
  }
}