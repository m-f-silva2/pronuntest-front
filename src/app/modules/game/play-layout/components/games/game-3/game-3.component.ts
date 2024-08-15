import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from '../../../game.service';
import { Subject, takeUntil } from 'rxjs';
import { LevelInfoComponent } from '../../level-info/level-info.component';

@Component({
  selector: 'app-game-3',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-3.component.html',
  styleUrl: './game-3.component.css'
})
export class Game3Component {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  section = 0
  sections = [{
    title: 'RECORDAR SECUENCIA DE SONIDOS',
    subtitle: 'Según la secuencia de palabras escuchadas intenta recrearla con el tablero!',
    image: 'string',
    next: '1',
    previous: undefined
  }]
  isCompleted = false
  @ViewChild('audio_m') audio_m!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_a') audio_a!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_e') audio_e!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_i') audio_i!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_o') audio_o!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_u') audio_u!: ElementRef<HTMLAudioElement>;
  secuenceGoal = ['a', 'e', 'i']
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
        this.audio_a.nativeElement.play()
        await this.sleep(1000)
        this.audio_e.nativeElement.play()
        await this.sleep(1000)
        this.audio_i.nativeElement.play()
      return
    }


    if(key === 'm'){
      this.audio_m.nativeElement.play()
    }else if(key === 'a'){
      this.audio_a.nativeElement.play()
    }else if(key === 'e'){
      this.audio_e.nativeElement.play()
    }else if(key === 'i'){
      this.audio_i.nativeElement.play()
    }else if(key === 'o'){
      this.audio_o.nativeElement.play()
    }else if(key === 'u'){
      this.audio_u.nativeElement.play()
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
