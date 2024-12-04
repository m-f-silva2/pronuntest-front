import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
  selector: 'app-game-j-panel',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-j-panel.component.html',
  styleUrl: './game-j-panel.component.css'
})
export class GameJPanelComponent {
  /* Panel barco */
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

  itemsResources: { img: string,     audio: string, correctPos: 0|1 }[] = []
  allItemsResources: { img: string,  audio: string, correctPos: 0|1 }[] = [
    { img: 'assets/images/isla2/chino.webp', audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/fila.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/hielo.webp', audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/luna.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/lupa.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/malo.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/mama.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/mapa.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/masa.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/palo.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/papa.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/pelo.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/pila.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/pino.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/pollo.webp', audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/puma.webp',  audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
    { img: 'assets/images/isla2/suma.webp ', audio: 'assets/audios/fonema_po.mp3', correctPos: 0 },
  ]
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private readonly _toastGameService: ToastGameService, public _gameService: GameService, private _toastService: ToastService) {
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

  private initData() {
    this.allItemsResources.sort(() => Math.random() - 0.5);
    this.isCompleted = false;
    this.sizeCorrectItems = 3;
    this.intents = 5;
    this.audio = '';
  }

  private restart() {
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  private startOrNext(){
    //Toma de la posición 3 hacia abajo
    this.itemsResources = [...[this.allItemsResources[(4-this.sizeCorrectItems)*2-1], this.allItemsResources[(4-this.sizeCorrectItems)*2]]]
    const correctPos = Math.floor(Math.random() * 2) as 0|1;
    this.itemsResources[0].correctPos = correctPos
    this.itemsResources[1].correctPos = correctPos
  }

  play() {
    this.initData()
    this.isRuning = true
    this.startOrNext()

    setTimeout(() => {
      this.handleClickNextAudio(this.itemsResources[this.itemsResources[0].correctPos].audio)
    }, 380)
  }

  handleClick(btn: 0|1|3) {
    if(btn === 3) return
    if (this.itemsResources[btn].correctPos === btn) {
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        setTimeout(() => {
          this.startOrNext()
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

