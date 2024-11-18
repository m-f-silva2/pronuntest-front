import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { GameService } from '../../../game.service';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-game-zz-inflatetow',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent],
  templateUrl: './game-zz-inflatetow.component.html',
  styleUrl: './game-zz-inflatetow.component.css'
})
export class GameZzInflatetowComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  section = 0
  sections = [{
    title: 'AHORA VAMOS A REPASAR EL SONIDO DEL FONEMA P',
    subtitle: '',
    resource: '/assets/video/explosion.mp4',
    next: '1',
    previous: undefined
  }]
  
  @ViewChild('balloon') balloon!: ElementRef;
  isCompleted = false
  countRecording = 0
  goal = 160
  isRecording = false;
  frequency: number = 0
  audioContext!: AudioContext;
  private mediaRecorder: MediaRecorder | null = null;

  constructor(private _gameService: GameService, private ref: ChangeDetectorRef) {
    /* this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity= res
    }) */
      this.sections = [{
        title: 'INFLAR GLOBO',
        subtitle: 'Exhala aire por la boca para inflar el globo',
        resource: '/assets/video/explosion.mp4',
        next: '1',
        previous: undefined
      }]
  }
  btnsNavegation(typeDirection: 'endNext'|'firstPrevious'|'previous'|'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next')? 1:-1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }


  /* === RECORDING === */
  ngAfterViewInit() {
    setTimeout(() => {
      this.startRecording()
    }, 2000);
  }
  
  async startRecording() {
    this.audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const intervalId = setInterval(() => {
      analyser.smoothingTimeConstant = 0.3;
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
      if (average > 29) {
        const aux = Math.round(average / 10);
        setTimeout(() => {
          this.moveBoat(aux)
          if(this.frequency > this.goal){
            analyser.disconnect()
            source.disconnect()
            clearInterval(intervalId)
            this.isCompleted = true
          }
        }, 200);
      }
    }, 200);
  }

  async moveBoat(num: number) {
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
}
