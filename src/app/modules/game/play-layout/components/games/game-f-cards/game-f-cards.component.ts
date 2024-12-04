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
  selector: 'app-game-f-cards',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-f-cards.component.html',
  styleUrl: './game-f-cards.component.css'
})
export class GameFCardsComponent {
  /* Cartas */
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  mode: 'front'|'back'|null = null
  isRuning = false
  sizeCorrectItems = 0
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  itemsResources: { id: number, completed: boolean, img: string, audio: string, active: boolean, phonema: string   , correctItem: boolean }[] = []
  allItemsResources: { id: number, completed: boolean, img: string, audio: string, active: boolean, phonema: string, correctItem: boolean }[][] = [
    [],
    [
      { id: 0, completed: false, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'po', correctItem: true },
      { id: 1, completed: false, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'po', correctItem: true },
    ],
    [
      { id: 2, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'pa', correctItem: false},
      { id: 3, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'pe', correctItem: false},
      { id: 4, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'pi', correctItem: true},
      { id: 5, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'po', correctItem: false},
      { id: 6, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'pu', correctItem: false},
      { id: 7, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', active: false, phonema: 'po', correctItem: true},
    ],
    [
      { id: 8, completed: false, img: 'assets/images/isla2/pelo.webp', audio:  'assets/audios/fonema_pe.mp3', active: false, phonema: 'pa',  correctItem: true },
      { id: 9, completed: false, img: 'assets/images/isla2/pila.webp', audio:  'assets/audios/fonema_pi.mp3', active: false, phonema: 'pe',  correctItem: true },
      { id: 10, completed: false, img: 'assets/images/isla2/pino.webp', audio: 'assets/audios/fonema_pi.mp3', active: false, phonema: 'pi', correctItem: true },
      { id: 11, completed: false, img: 'assets/images/isla2/pollo.webp', audio:'assets/audios/fonema_po.mp3', active: false, phonema:'po', correctItem: true },
      { id: 12, completed: false, img: 'assets/images/isla2/puma.webp', audio: 'assets/audios/fonema_pu.mp3', active: false, phonema: 'pu', correctItem: true },
      { id: 13, completed: false, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/fonema_pa.mp3', active: false, phonema: 'po', correctItem: true },
    ],
  ]
  //TODO: Que sonido suena como "variable"

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _toastGameService: ToastGameService, public _gameService: GameService, private _toastService: ToastService) {
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
    if(this._gameService.currentGame.posIsland === 2 && (this._gameService.currentGame.posLevel === 2 || this._gameService.currentGame.posLevel === 3)){
      this.mode = 'front'
    }else{
      this.mode = 'back'
    }

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
    this.initData()
  }

  initData() {
    const sectionMode = this.mode == 'front'? this.section + 2 : this.section
    this.itemsResources = [...this.allItemsResources[sectionMode]]

    this.isCompleted = false
    this.sizeCorrectItems = this.itemsResources.filter(res=>res.correctItem === true).length || 0
    this.intents = this.itemsResources.length-1 || 0
    this.audio = ''
    this.itemsResources?.forEach(res => res.completed = false)
  }

  intervalTopo: any
  play() {
    this.initData()
    this.isRuning = true
    setTimeout(() => {
      this.handleClickNextAudio(this.itemsResources[this.sizeCorrectItems-1]!.audio)
    }, 380)

    this.intervalTopo = setInterval(() => {
      const randomPos = Math.floor(Math.random() * this.itemsResources.length)
      if(this.itemsResources[randomPos].active == false){
        this.itemsResources[randomPos].active = true
        setTimeout(() => {
          if(!this.itemsResources[randomPos]) return
          this.itemsResources[randomPos].active = false
        }, 2780);
      }
    }, 300);
  }
  restart() {
    clearInterval(this.intervalTopo)
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  handleClick(btn: number) {
    this.itemsResources[btn].completed = true;
    if ((this.itemsResources[btn].correctItem && this.mode === 'back') 
      || (this.itemsResources[btn].id == this.itemsResources[this.sizeCorrectItems-1].id && this.mode === 'front')) {
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        setTimeout(() => {
          this.handleSecondaryAudio(['assets/audios/sonido_excelente.mp3', 'assets/audios/sonido_perfecto.mp3'][Math.floor(Math.random() * 2)])
        }, 10);
        setTimeout(() => {
          this.handleClickNextAudio(this.itemsResources[this.sizeCorrectItems-1].audio)
        }, 900);
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
      if(this.audio){
        (document.getElementById('audio') as HTMLAudioElement).play();
      }
    }, 4);
  }

  handleSecondaryAudio(_audio: string) {
    this.audioAux = _audio;
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 2);
  }
}

