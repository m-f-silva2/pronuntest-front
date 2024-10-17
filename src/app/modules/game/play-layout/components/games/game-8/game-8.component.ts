import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-game-8',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent],
  templateUrl: './game-8.component.html',
  styleUrl: './game-8.component.css'
})
export class Game8Component {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = []
  section = 0
  countRecording = 0
  dataGames: IDataGame
  isCompleted = false
  audios = ['assets/audios/fonema_m.wav', 'assets/audios/fonema_p.wav', 'assets/audios/fonema_k.wav', 'assets/audios/fonema_s.wav','assets/audios/fonema_t.wav']
  sounds = [false, false, false]
  itemsResources = [
    { img: 'assets/images/isla0/vaca.png',  audio: 'assets/audios/fonema_m.mp3' , part: 'nariz'   },
    { img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_pu.mp3', part: 'boca'    },
    { img: 'assets/images/isla0/abeja.svg', audio: 'assets/audios/fonema_ch.wav', part: 'garganta'},
  ]
  itemsResourcesPos = -1
  audio: string = '';
  
  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Escucha el sonido de la imagen y repítelo tú mismo. Luego, observa el dibujo y decide si el sonido se produce en la nariz, la boca o la garganta.',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })

    this.itemsResourcesPos = Math.floor(Math.random() * 3)

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }


  handleClick(btn: number){
    this.sounds[btn] = true;
    (document.getElementById('audio'+btn) as HTMLAudioElement).play();

    if(this.sounds.every(res=>res===true)){
      this.isCompleted = true
      this._toastService.toast.set({ type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => { 
        this._toastService.toast.set(undefined)
      }})
    }
  }

    /* DROP */
    dragStart(ev: any) {
      ev.dataTransfer.effectAllowed='move';
      ev.dataTransfer.setData("Text", ev.currentTarget.getAttribute('id'));
      ev.dataTransfer.setDragImage(ev.currentTarget,50,50);
      return true;
    }
    // these  prevents default behavior of browser
    dragEnter(event: any) {
      event.preventDefault();
      return true;
    }
    dragOver(event: any) {
      event.preventDefault();
    }
    // defined for when drop element on target
    dragDrop(ev: any, parteCuerpo: string) {
      const data = ev.dataTransfer.getData("Text");
      if(this.itemsResources[this.itemsResourcesPos].part  === parteCuerpo){
        ev.target.appendChild(document.getElementById(data));
        ev.stopPropagation();

        this.isCompleted = true
        this.handleClickNextAudio('assets/audios/sonido_excelente.mp3')
        this.isCompleted = true
        this._toastService.toast.set({
          type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
            this._toastService.toast.set(undefined)
          }
        })

      }
      return false;
    }
    /* END DROP */


    handleClickNextAudio(_audio: string) {
      this.audio = _audio;
      setTimeout(() => {
        (document.getElementById('audioAux') as HTMLAudioElement).play();
      }, 10);
    }
}
