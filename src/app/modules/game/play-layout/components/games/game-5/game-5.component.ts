import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { Subject } from 'rxjs';
import { GameService } from '../../../game.service';

@Component({
  selector: 'app-game-5',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-5.component.html',
  styleUrl: './game-5.component.css'
})
export class Game5Component {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  section = 0
  sections = [{
    title: 'MUEVE EL OBJETO CORRECTO',
    subtitle: 'Mueve el objeto de acuerdo al sonido escuchado',
    image: 'string',
    next: '1',
    previous: undefined
  }]
  @ViewChild('audio_pulpo') audio_pulpo!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_mapa') audio_mapa!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_pollo') audio_pollo!: ElementRef<HTMLAudioElement>;
  @ViewChild('audio_puma') audio_puma!: ElementRef<HTMLAudioElement>;
  isCompleted = false

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
  dragDrop(ev: any) {
    const data = ev.dataTransfer.getData("Text");
    if(data === 'boxA'){
      ev.target.appendChild(document.getElementById(data));
      ev.stopPropagation();
      this.isCompleted = true
    }
    return false;
  }

  async handlePlay(key?:string){
    if(!key){
      this.audio_pollo.nativeElement.play()
      return
    }

    if(key === 'pulpo'){
      this.audio_pulpo.nativeElement.play()
    }else if(key === 'mapa'){
      this.audio_mapa.nativeElement.play()
    }else if(key === 'pollo'){
      this.audio_pollo.nativeElement.play()
    }else if(key === 'puma'){
      this.audio_puma.nativeElement.play()
    }
  }

}
