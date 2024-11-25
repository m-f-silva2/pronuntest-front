import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { CommonModule } from '@angular/common';
import { ConffetyComponent } from '../../conffety/conffety.component';

@Component({
  selector: 'app-game-b-face',
  standalone: true,
  imports: [CommonModule, LevelInfoComponent, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-b-face.component.html',
  styleUrl: './game-b-face.component.css'
})
export class GameBFaceComponent {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = []
  dataGames: IDataGame
  sounds = [false, false, false]
  isCompleted = false
  section = 0
  countRecording = 0
  itemsResources = [
    { img: 'assets/images/isla0/vaca.png',  audio: 'assets/audios/fonema_m.wav' , part: 'nariz'   },
    { img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', part: 'boca'    },
    { img: 'assets/images/isla1/pregunta.svg', audio: 'assets/audios/fonema_ch.wav', part: 'garganta'},
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
    this.itemsResources = this.shuffleArray(this.itemsResources);
    this.itemsResourcesPos = 0; // Comenzar desde la primera posición después del barajado

  }
  // Método para barajar el array
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    dragDrop(ev: any, parteCuerpo: string) {
      const data = ev.dataTransfer.getData("Text");
      
      if (this.itemsResources[this.itemsResourcesPos].part === parteCuerpo) {
        ev.target.appendChild(document.getElementById(data));
        ev.stopPropagation();
        // Avanzar a la siguiente imagen
        this.itemsResourcesPos++;

        if (this.itemsResourcesPos >= this.itemsResources.length) {
          this.isCompleted = true;
        
          setTimeout(() => {
            this.handleClickNextAudio('assets/audios/gritos_ganaste.mp3');
            this.isCompletedAux = true;
            this._toastGameService.toast.set({
              type: 's', timeS: 3, title: "¡Ganaste!", message: "Nivel completado con éxito!", end: () => {
                this._toastGameService.toast.set(undefined);
              }
            });
          }, 500);
      
          setTimeout(() => {
            this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3');
            this.isCompleted = true;
            this.isRuning = false;
      
            // Avanzar a la siguiente imagen
            this.itemsResourcesPos++;
            if (this.itemsResourcesPos >= this.itemsResources.length) {
              this.itemsResourcesPos = 0; // Reiniciar a la primera imagen si se completan todas
            }
          }, 3300);
          this.itemsResourcesPos = -1; // Resetea el índice si se completan todas las imágenes
        }else{
          // Acción cuando el drop es exitoso
          this.handleClickNextAudio('assets/audios/sonido_excelente.mp3');
          this._toastService.toast.set({
            type: 's', timeS: 3, title: "¡Bien hecho!", message: "¡sigue jugando!", end: () => {
              this._toastService.toast.set(undefined);
            }
          });
        }
      } else {
        this.handleClickNextAudio('assets/audios/error.mp3');
        setTimeout(() => {
          this.handleClickNextAudio('assets/audios/sonido_intentalo_nuevo.mp3');
        }, 400);
      }
    
      return false;
    }
    
    isCompletedAux = false


    handleClickNextAudio(_audio: string) {
      this.audio = _audio;
      setTimeout(() => {
        (document.getElementById('audioAux') as HTMLAudioElement).play();
      }, 10);
    }
}
