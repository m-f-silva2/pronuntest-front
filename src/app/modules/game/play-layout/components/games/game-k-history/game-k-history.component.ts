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
  itemsResources:    { id: number, img: string, audio: string, active: boolean, class: string, styles: string, correct: boolean }[] = []
  allItemsResources: { id: number, img: string, audio: string, active: boolean, class: string, styles: string, correct: boolean }[][] = [
    [],
    [
      /* style para el left y top, right y bottom, width y height, z-index */
      { id: 0, img: 'assets/images/isla3/bosque.jpg', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 0%; left: 10%; width: auto; height: 100%; z-index: 1', correct: true },
      { id: 0, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 40%; left: 10%; width: auto; height: 19%; z-index: 10', correct: true },
      { id: 0, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 10%; left: 21%; width: auto; height: 15%; z-index: 10', correct: false },
      { id: 0, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 20%; left: 32%; width: auto; height: 15%; z-index: 10', correct: false },

      { id: 0, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 20%; left: 42%; width: auto; height: 25%; z-index: 10', correct: false },
      { id: 0, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 20%; left: 52%; width: auto; height: 35%; z-index: 10', correct: false },
      { id: 0, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 20%; left: 62%; width: auto; height: 45%; z-index: 10', correct: false },
    ],
    [
      /* style para el left y top, right y bottom, width y height, z-index */
      { id: 0, img: 'assets/images/isla3/bosque.jpg', audio: 'assets/audios/fonema_p.wav', class: 'entryAbove', active: false, styles: 'bottom: 0%; left: 10%; width: auto; height: 100%; z-index: 1', correct: true },
      { id: 0, img: 'assets/images/isla2/pino.webp', audio: 'assets/audios/fonema_p.wav', class: '', active: false, styles: 'bottom: 40%; left: 10%; width: auto; height: 15%; z-index: 10', correct: false },
      { id: 0, img: 'assets/images/isla2/pino.webp', audio: 'assets/audios/fonema_p.wav', class: '', active: false, styles: 'bottom: 10%; left: 21%; width: auto; height: 15%; z-index: 10', correct: false },
      { id: 0, img: 'assets/images/isla2/pino.webp', audio: 'assets/audios/fonema_p.wav', class: '', active: false, styles: 'bottom: 20%; left: 32%; width: auto; height: 19%; z-index: 10', correct: true },
    ],
  ]
  // 'fr'+count;    'exitLeft'

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
    
    /* setTimeout(() => {
      this.handleClickNextAudio(this.correctItemResource!.audio)
    }, 380) */
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

