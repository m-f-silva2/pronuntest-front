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
  audios = ['assets/audios/fonema_k.wav', 'assets/audios/fonema_p.wav', 'assets/audios/fonema_s.wav', 'assets/audios/fonema_ch.wav','assets/audios/fonema_m.wav']
  itemsCompleted = [false, false, false, false, false]
  yItemsEnd = [558, 605, 710, 810, 915]
  lastItemY = 0
  correctItems = [false, false, true, false, true]
  sizeCorrectItems = 2
  intents = 2

  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Vamos a escuchar sonidos de la letra '+this._gameService.structure?.phoneme_type+' \n\nToca las burbujas que más se parezcan al sonido que escuches',
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
      if(count > 960){
        clearInterval(this.interval)
        if(this.sizeCorrectItems > 0){
          this.isCompleted = true
          this._toastService.toast.set({ type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => { 
            this._toastService.toast.set(undefined)
          }})
        }
      }
      
      if(count > this.yItemsEnd[this.lastItemY]){
        this.itemsCompleted[this.lastItemY] = true
        this.lastItemY++
      }
    }, 20);
  }

  handleClick(btn: number){
    this.itemsCompleted[btn] = true;
    (document.getElementById('audio'+btn) as HTMLAudioElement).play();

    if(this.correctItems[btn]){
      this.sizeCorrectItems--
    }else{
      this.intents--
    }

    if(this.sizeCorrectItems == 0 && this.intents>0){
      clearInterval(this.interval)
      this.isCompleted = true
      this._toastService.toast.set({ type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => { 
        this._toastService.toast.set(undefined)
      }})
    }else if(this.intents == 0){
      this._toastService.toast.set({ type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => { 
        this._toastService.toast.set(undefined)
      }})
    }
  }
}