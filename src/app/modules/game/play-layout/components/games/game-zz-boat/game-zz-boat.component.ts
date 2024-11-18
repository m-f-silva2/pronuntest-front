import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { GameService } from '../../../game.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-game-zz-boat',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent],
  templateUrl: './game-zz-boat.component.html',
  styleUrl: './game-zz-boat.component.css'

})
export class GameZzBoatComponent {
  sumaryActivity: SumaryActivities | undefined
  sections = [{
    title: 'AHORA VAMOS A REPASAR EL SONIDO DEL FONEMA P',
    subtitle: '',
    resource: '/assets/video/explosion.mp4',
    next: '1',
    previous: undefined
  }]
  section = 0
  @ViewChild('boat') boat!: ElementRef;
  isCompleted = false
  
  countRecording = 0
  goal = 80
  private mediaRecorder: MediaRecorder | null = null;
  public isRecording = false;
  frequency: number = 0
  audioContext!: AudioContext;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _gameService: GameService, private ref: ChangeDetectorRef) {
    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity= res
    })
  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }

  handleRecording() {
      if(this.section == 1){
        this.startRecording()
      }
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

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async moveBoat(num: number) {
    for (let i = 0; i < num; i++) {
      this.boat.nativeElement.style.bottom = (this.frequency + i) + '%'
      this.ref.detectChanges()
      await this.sleep(20);
    }
    this.frequency += num
  }
  
}
