import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { GameService } from '../../../game.service';
import { LevelInfoComponent } from '../../level-info/level-info.component';

@Component({
  selector: 'app-game-4',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-4.component.html',
  styleUrl: './game-4.component.css'
})
export class Game4Component {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  section = 0
  sections = [{
    title: 'INFLAR GLOBO',
    subtitle: 'Pronunciar la palabra pulpo para inflar el globo',
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
