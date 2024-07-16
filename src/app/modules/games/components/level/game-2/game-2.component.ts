import { Component } from '@angular/core';
import { LevelService } from '../../../levels/levels.service';
import { Subject, takeUntil } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { LevelInfoComponent } from '../../level-info/level-info.component';

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
  
  constructor(private _levelService: LevelService) {
    this._levelService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }
  
  btnsEvent(event: { value?: string | undefined; type: string; }) {
    this.section = Number(event.value)
  }
}
