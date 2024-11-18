import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from '../../../game.service';
import { Subject, takeUntil } from 'rxjs';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-game-zz-sequence',
  standalone: true,
  imports: [LevelInfoComponent, BtnImgComponent],
  templateUrl: './game-zz-sequence.component.html',
  styleUrl: './game-zz-sequence.component.css'
})
export class GameZzSequenceComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  section = 0
  sections = [{
    title: 'RECORDAR SECUENCIA DE SONIDOS',
    subtitle: 'Según la secuencia de palabras escuchadas en el audio intentar recrearla con el tablero a continuación!',
    resource: '',
    next: '1',
    previous: undefined
  }]
  isCompleted = false
  @ViewChild('audio_pie') audio_pie!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_pelo') audio_pelo!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_pino') audio_pino!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_pollo') audio_pollo!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_pan') audio_pan!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_mapa') audio_mapa!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_papa') audio_papa!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_a') audio_a!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_i') audio_i!: ElementRef<HTMLAudioElement>;
  secuenceGoal = ['pollo', 'pie', 'pelo', 'mapa']
  secuenceSave:string[] = []    

  constructor(private _gameService: GameService, private ref: ChangeDetectorRef) {
    /* this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity= res
    }) */
  }
  btnsNavegation(typeDirection: 'endNext'|'firstPrevious'|'previous'|'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next')? 1:-1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async handlePlay(key?:string){
    if(!key){
        this.audio_pollo.nativeElement.play()
        await this.sleep(1000)
        this.audio_pie.nativeElement.play()
        await this.sleep(1000)
        this.audio_pelo.nativeElement.play()
        await this.sleep(1000)
        this.audio_mapa.nativeElement.play()
      return
    }

    if(key === 'pie'){
      this.audio_pie.nativeElement.play()
    }else if(key === 'pelo'){
      this.audio_pelo.nativeElement.play()
    }else if(key === 'pino'){
      this.audio_pino.nativeElement.play()
    }else if(key === 'pollo'){
      this.audio_pollo.nativeElement.play()
    }else if(key === 'pan'){
      this.audio_pan.nativeElement.play()
    }else if(key === 'mapa'){
      this.audio_mapa.nativeElement.play()
    }else if(key === 'papa'){
      this.audio_papa.nativeElement.play()
    }else if(key === 'a'){
      this.audio_a.nativeElement.play()
    }else if(key === 'i'){
      this.audio_i.nativeElement.play()
    }

    //Logica secuencia
    this.secuenceSave.push(key)
    const isIncorrect = this.secuenceSave.some((save, index) => save !== this.secuenceGoal[index])
    if(!isIncorrect){
      this.isCompleted = this.secuenceSave.length === this.secuenceGoal.length
    }else{
      this.secuenceSave = []
    }

  }
}
