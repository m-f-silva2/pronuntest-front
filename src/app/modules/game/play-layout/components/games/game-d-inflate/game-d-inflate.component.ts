import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { GameService, IDataGame } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { CommonModule } from '@angular/common';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { ConffetyComponent } from '../../conffety/conffety.component';

@Component({
  selector: 'app-game-d-inflate',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-d-inflate.component.html',
  styleUrl: './game-d-inflate.component.css'
})
export class GameDInflateComponent {
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  autoplay = false
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  intents = 5;
  audio: string = '';
  audioAux: string = '';

  @ViewChild('balloon') balloon!: ElementRef;
  countRecording = 0
  goal = 130
  isRecording = false;
  frequency: number = 0
  audioContext!: AudioContext;

  correctItemResource?: { id: number, completed: boolean, img: string, audio: string, sizeCorrectItems: number, intents: number }
  private mediaRecorder: MediaRecorder | null = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _toastGameService: ToastGameService, public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Vamos a escuchar sonidos de la letra ' + this._gameService.structure?.phoneme_type + ' \n\nToca las burbujas que más se parezcan al sonido que escuches',
      subtitle: undefined,
      resource: "https://www.youtube.com/embed/42SjtrTtBjk?si=k7II4KUNu6y4TNik&amp;start=0&autoplay=1",
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
    if(this.balloon){
      this.balloon.nativeElement.style.width = '12px'
    }
    /* this.intents = this.correctItemResource?.intents || 0 */
    this.frequency = 0
    this.audio = ''
    this.correctItemResource = { id: 0, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p_2.wav', sizeCorrectItems: 80, intents: 50 }
  }
  play() {
    this.initData()
    this.isRuning = true
    setTimeout(() => {
      this.handleClickNextAudio(this.correctItemResource!.audio)
    }, 380)
  }
  restart() {
    this.autoplay = false;
    this.stopRecording()
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 800);
  }

  async startRecording() {
    this.audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    this.isRecording = true
    const intervalId = setInterval(() => {
      analyser.smoothingTimeConstant = 0.5;
      analyser.fftSize = 1024;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let values = 0;
      let length = dataArray.length;
      for (let i = 0; i < length; i++) {
        values += dataArray[i];
      }
      let average = values / length;
      if (average > 15) {
        const aux = Math.round(average / 10);
        setTimeout(() => {
          this.inflateBalloon(aux)
          if (this.frequency > this.goal) {
            analyser.disconnect()
            source.disconnect()
            clearInterval(intervalId)

            this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
            this.restart()
            this.isRuning=true;
            setTimeout(() => {
              this.isCompleted = true;
              this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3');
              this._toastGameService.toast.set({
                type: 'finish', timeS: 3, title: "¡ISLA COMPLETADA!", message: "¡Increíble! Has completado toda la isla!", end: () => {
                  this._toastGameService.toast.set(undefined)
                  window.location.href = '/games/island';
                }
              })
            }, 500);

          }
        }, 400);

      }
    }, 200);
  }

  async inflateBalloon(num: number) {
    for (let i = 0; i < num; i++) {
      this.balloon.nativeElement.style.width = (this.frequency + i) + 'px'
      this.ref.detectChanges()
      await this.sleep(20);
    }
    this.frequency += num
  }
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
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

