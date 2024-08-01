import { ChangeDetectorRef, Component } from '@angular/core';
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
}
