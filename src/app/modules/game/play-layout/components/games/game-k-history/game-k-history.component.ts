import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { IDataGame, GameService } from '../../../game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';
import { LevelInfoComponent } from '../../level-info/level-info.component';

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
  itemsResources:    { id: number, img: string, audio: string, active: boolean, styles: string }[] = []
  allItemsResources: { id: number, img: string, audio: string, active: boolean, styles: string }[][] = [
    [],
    [
      /* style para el left y top, right y bottom, width y height, z-index */
      { id: 0, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/fonema_p.wav', active: false, styles: 'bottom: 40%; left: 10%; width: auto; height: 15%; z-index: 10' },
      { id: 0, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/fonema_p.wav', active: false, styles: 'bottom: 10%; left: 21%; width: auto; height: 15%; z-index: 10' },
      { id: 0, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/fonema_p.wav', active: false, styles: 'bottom: 20%; left: 32%; width: auto; height: 15%; z-index: 10' },
    ],
  ]

  correctItemResource?: { id: number, img: string, audio: string, sizeCorrectItems: number, intents: number,  }
  allCorrectItemBySection: { id: number, img: string, audio: string, sizeCorrectItems: number, intents: number,  }[] = [
    { id: -1, img: '', audio: '', sizeCorrectItems: -1, intents: -1 },
    { id: 1, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', sizeCorrectItems: 2, intents: 2,  },
    { id: 1, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', sizeCorrectItems: 2, intents: 6,  },
  ]


  /* sizeCorrectItems = 0; */
  intents = 5;
  audio: string = '';
  audioAux: string = '';
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
    this.itemsResources = this.allItemsResources[this.section]
    this.correctItemResource = this.allCorrectItemBySection[this.section]
    this.isCompleted = false
    this.sizeCorrectItems = 2 //this.correctItemResource?.sizeCorrectItems || 0
    this.intents = this.correctItemResource?.intents || 0
    this.audio = ''
    /* this.itemsResources.forEach(res => res.completed = false) */
  }

  intervalTopo: any
  play() {
    this.initData()
    
    this.isRuning = true
    setTimeout(() => {
      this.handleClickNextAudio(this.correctItemResource!.audio)
    }, 380)

    let count = 0
    this.intervalTopo = setInterval(() => {
      setTimeout(() => {
        count++
        this.frameClass = 'fr'+count
        console.log('>> >>: si o no perror', this.frameClass);
        if(count == 2){
          clearInterval(this.intervalTopo)
          this.frameClass = 'exitLeft'
        }
      }, 1600);
    }, 2000);
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
    if (true) {
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

