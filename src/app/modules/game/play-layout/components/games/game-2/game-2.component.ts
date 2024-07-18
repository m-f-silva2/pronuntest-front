import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { LevelService } from '../../../levels.service';

@Component({
  selector: 'app-game-2',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-2.component.html',
  styleUrl: './game-2.component.css'

})
export class Game2Component {
  levelStructure: LevelStructure | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections = [{
    title: 'VAMOS A PRONUNCIAR LA PALABRA POLLO',
    subtitle: undefined,
    image: 'string',
    next: '1',
    previous: undefined
  }]
  section = 0
  countRecording = 0

  constructor(private _levelService: LevelService, private ref: ChangeDetectorRef) {
    this._levelService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }

  btnsEvent(event: { value?: string | undefined; type: string; }) {
    this.section = Number(event.value)
  }


  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  public isRecording = false;
  public audioUrl: string | null = null;

  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      setTimeout(() => {
        this.ref.markForCheck();
        console.log('>> game-2.component >> :', )
      }, 200);
    };

    this.mediaRecorder.start();
    this.isRecording = true;

    setTimeout(() => {
      this.stopRecording()
      this.countRecording = 0
    }, 6000);

    this.countRecording = 1
    setInterval(() => {
      if(this.countRecording === 0){ return }
      this.countRecording++
    }, 1000);
    
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

}
