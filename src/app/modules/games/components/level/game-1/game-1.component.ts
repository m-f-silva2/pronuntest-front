import { Component } from '@angular/core';
import { LevelService } from '../../../levels/levels.service';
import { Subject, takeUntil } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';

@Component({
  selector: 'app-game-1',
  standalone: true,
  imports: [],
  templateUrl: './game-1.component.html',
  styleUrl: './game-1.component.css'
})
export class Game1Component {
  levelStructure: LevelStructure | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _levelService: LevelService){
    this._levelService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }
}
