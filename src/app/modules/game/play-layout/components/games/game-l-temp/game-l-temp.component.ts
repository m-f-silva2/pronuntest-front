import { Component, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';

@Component({
  selector: 'app-game-l-temp',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-l-temp.component.html',
  styleUrl: './game-l-temp.component.css'
})
export class GameLTempComponent {
  /* CARDS - Cartas */
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  sizeCorrectItems = 0;
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private _toastGameService: ToastGameService, public _gameService: GameService, private renderer: Renderer2, private _toastService: ToastService) {
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
    this.isCompleted = false
    /* this.itemsResources = this.allItemsResources[this.section]
    this.intents = this.itemsResources.length
    this.sizeCorrectItems = this.itemsResources.filter(res=>res.isCorrect).length */
  }

  play() {
  }

  handleClick(btn: number) {
    //this.itemsResources[btn].completed = true

    if (true /* this.itemsResources[btn].isCorrect */) {
      /* this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].completed = true */
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        //this.handleClickNextAudio(this.itemsResources[btn].audio)
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
    /* this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
    this.itemsResources.forEach(res => res.completed = false) */
    //this.correctItemsResources.forEach(res => res.completed = false)
    //this.intents = this.itemsResources.length
    //this.sizeCorrectItems = this.itemsResources.filter(res=>res.isCorrect).length
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

