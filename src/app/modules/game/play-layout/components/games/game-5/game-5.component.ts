import { ChangeDetectorRef, Component } from '@angular/core';
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
    console.log('>> >>  ev:', ev);
    ev.target.appendChild(document.getElementById(data));
    ev.stopPropagation();
    return false;
  }

}
