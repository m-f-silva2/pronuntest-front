import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Component } from '@angular/core';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ToastGameService } from 'src/app/core/services/toast_game/toast-game.service';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';
import { IDataGame, GameService } from '../../../game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';
import { LevelInfoComponent } from '../../level-info/level-info.component';

@Component({
  selector: 'app-game-j-panel',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-j-panel.component.html',
  styleUrl: './game-j-panel.component.css'
})
export class GameJPanelComponent {
  /* Panel barco */
  autoplay = true
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  sizeCorrectItems = 3
  intents = 5;
  audio: string = '';
  audioAux: string = '';

  itemsResources!: { imgA: string, imgB: string,    audioAB: string[], correctPos: 0|1 }
  allItemsResources: { imgA: string, imgB: string, audioAB: string[], correctPos: 0|1 }[] = [
    { imgA: 'assets/images/isla2/palo.webp', imgB: 'assets/images/isla2/malo.webp',  audioAB: ['assets/audios/palo.mp3', 'assets/audios/malo.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/pelo.webp', imgB: 'assets/images/isla2/hielo.webp', audioAB: ['assets/audios/pelo.mp3', 'assets/audios/hielo.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/pila.webp', imgB: 'assets/images/isla2/fila.webp',  audioAB: ['assets/audios/pila.mp3', 'assets/audios/fila.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/yoyo.webp', imgB: 'assets/images/isla2/pollo.webp', audioAB: ['assets/audios/yoyo.mp3', 'assets/audios/pollo.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/lupa.webp', imgB: 'assets/images/isla2/luna.webp',  audioAB: ['assets/audios/lupa.mp3', 'assets/audios/luna.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/mapa.webp', imgB: 'assets/images/isla2/masa.webp',  audioAB: ['assets/audios/mapa.mp3', 'assets/audios/masa.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/puma.webp', imgB: 'assets/images/isla2/suma.webp',  audioAB: ['assets/audios/puma.mp3', 'assets/audios/suma.mp3'], correctPos: 0 },
    { imgA: 'assets/images/isla2/pino.webp', imgB: 'assets/images/isla2/chino.webp', audioAB: ['assets/audios/pino.mp3', 'assets/audios/chino.mp3'], correctPos: 0 }
  ]
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private readonly _toastGameService: ToastGameService, public _gameService: GameService, private readonly _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Descubre la palabra que se escucha.',
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

  private initData() {
    this.allItemsResources.sort(() => Math.random() - 0.5);
    this.isCompleted = false;
    this.sizeCorrectItems = 3;
    this.intents = 5;
    this.audio = '';
  }

  private restart() {
    this.autoplay = false;
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  private startOrNext(){
    //Toma de la posición 3 hacia abajo
    this.itemsResources = this.allItemsResources[(4-this.sizeCorrectItems)*2]
    this.itemsResources.correctPos = Math.floor(Math.random() * 2) as 0|1;
    this.handleClickNextAudio(this.itemsResources.audioAB[this.itemsResources.correctPos])
  }

  play() {
    this.initData()
    this.isRuning = true
    
    setTimeout(() => {
      this.startOrNext()
    }, 180)
  }

  handleClick(btn: 0|1|3) {
    if(btn === 3) return
    if (this.itemsResources.correctPos === btn) {
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        this.handleSecondaryAudio(['assets/audios/sonido_excelente.mp3', 'assets/audios/sonido_perfecto.mp3'][Math.floor(Math.random() * 2)])
        setTimeout(() => {
          this.startOrNext()
        }, 999);
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

