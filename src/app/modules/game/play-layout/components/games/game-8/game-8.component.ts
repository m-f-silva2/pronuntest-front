import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';
import { ToastGameService } from 'src/app/core/services/toast_game/toast-game.service';

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
    { img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', part: 'boca'    },
    { img: 'assets/images/isla0/abeja.svg', audio: 'assets/audios/fonema_ch.wav', part: 'garganta'},
  ]
  itemsResourcesPos = -1
  audio: string = '';
  isRuning = false
  
  constructor(private _toastGameService: ToastGameService,public _gameService: GameService, private ref: ChangeDetectorRef, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Escucha el sonido de la imagen y repítelo tú mismo. Luego, observa el dibujo y decide si el sonido se produce en la nariz, la boca o la garganta.',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })

    this.itemsResourcesPos = 1 //Math.floor(Math.random() * 3)

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  play() {
    this.handleClickNextAudio(this.itemsResources[this.itemsResourcesPos].audio)
    this.isRuning = true
    document.getElementById('startDrag')!.appendChild(document.getElementById('boxA')!);
    this.isCompletedAux = false
    this.isCompleted = false
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
        
        setTimeout(() => {
          this.handleClickNextAudio('assets/audios/gritos_ganaste.mp3')
          this.isCompletedAux = true
          this._toastGameService.toast.set({
            type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
              this._toastGameService.toast.set(undefined)
            }
          })
        }, 500);
        setTimeout(() => {
          this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
          this.isCompleted = true
          this.isRuning = false
        }, 3300);
        
      }else{
        this.handleClickNextAudio('assets/audios/error.mp3')
      }
      return false;
    }
    /* END DROP */
    isCompletedAux = false


    handleClickNextAudio(_audio: string) {
      this.audio = _audio;
      setTimeout(() => {
        (document.getElementById('audioAux') as HTMLAudioElement).play();
      }, 10);
    }
}
