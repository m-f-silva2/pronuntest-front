import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-1',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-1.component.html',
  styleUrl: './game-1.component.css'
})
export class Game1Component {
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
  dataGames: IDataGame

  constructor(private _gameService: GameService, private ref: ChangeDetectorRef, private router: Router) {
    this.dataGames = this._gameService.dataGames

    this._gameService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }

  btnsNavegation(typeDirection: 'endNext'|'firstPrevious'|'previous'|'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next')? 1:-1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
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
      this.ref.markForCheck();
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.setArc({target: {value: 0, min: 0, max: 100}})


    setTimeout(() => {
      this.stopRecording()
      this.countRecording = 0
    }, 6000);

    this.countRecording = 1
    setInterval(() => {
      if (this.countRecording === 0) { return }
      this.countRecording++
      this.setArc({target: {value: 16.66666666*(this.countRecording/100), min: 0, max: 100}})
    }, 10);

  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  
  setArc(event: { target: {value: number, min: number, max: number } }) {
    const spinner = document.querySelector('.spinner')! as HTMLElement
    const line = spinner.querySelector('.line')! as SVGGeometryElement
  
    const pathLength = line.getTotalLength()
    const radius = Number(line.getAttribute('r'))
    const piR2 = 2 * Math.PI * radius
    const { value, min, max } = event.target


    const val = value  //parseInt(value, 10)
    const length = Math.abs(((val / max) * piR2) / pathLength).toFixed(2)
    /* const percent = ((value - min) / (max - min) * 100) */

    spinner.style.setProperty('--stroke-dasharray', `${length} 1`)
    spinner.style.setProperty('--stroke-dashoffset', val < 0 ? (Number(length) * 2)+'' : '0')
    spinner.style.setProperty('--stroke-timing', val === 0 ? '0ms' : '300ms')
  }

}
