import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { IDataGame, GameService } from '../../../game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { allItemsResourcesHistory } from './history-data';

@Component({
  selector: 'app-game-k-history',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-k-history.component.html',
  styleUrl: './game-k-history.component.css'
})
export class GameKHistoryComponent {
  /* history */
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  sizeCorrectItems = 0
  frameClass = ''
  intents = 5;
  audio: string = '';
  audioAux: string = '';

  itemsResources:    { id: number, img: string, audio: string, active: boolean, class: string, styles: string, correct: boolean }[] = []
  allItemsResources: { id: number, img: string, audio: string, active: boolean, class: string, styles: string, correct: boolean }[][] = allItemsResourcesHistory
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private readonly _toastGameService: ToastGameService, public _gameService: GameService,  private readonly _toastService: ToastService) {
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
    this.isCompleted = false
    this.allItemsResources.forEach((list, i) => {
      list.forEach(res => {
        if(i === 1){
          res.class = 'entryAbove';
        }else{
          res.class = '';
        }
      });
    });

    this.sizeCorrectItems = this.allItemsResources.length - 1 //this.correctItemResource?.sizeCorrectItems || 0
    this.itemsResources = this.allItemsResources[this.allItemsResources.length - this.sizeCorrectItems]
    this.intents = 10 //FIXME: determinar intentos
    this.audio = ''
    /* this.itemsResources.forEach(res => res.completed = false) */
  }

  intervalTopo: any
  play() {
    this.initData()
    this.isRuning = true
    
    setTimeout(() => {
      this.handleSecondaryAudio('assets/audios/historia-1-001.mp3');
    }, 180)
  }
  restart() {
    clearInterval(this.intervalTopo)
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  handleClick(btn: number) {
    /* this.itemsResources[btn].completed = true; */
    if (this.itemsResources[btn].correct) {
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      this.itemsResources.forEach((res, i) => {
        res.class =  i%2===0 ? 'exitLeft': 'exitRight'
      });
      this.itemsResources = this.allItemsResources[this.allItemsResources.length - this.sizeCorrectItems]
      if (this.sizeCorrectItems != 0) {
        this.itemsResources.forEach((res, i) => res.class = 'entryAbove' );
        setTimeout(() => {
          this.handleSecondaryAudio('assets/audios/historia-1-00'+(this.allItemsResources.length - this.sizeCorrectItems)+'.mp3');
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

