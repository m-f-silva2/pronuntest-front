import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-10',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-10.component.html',
  styleUrl: './game-10.component.css'
})
export class Game10Component {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = []
  section = 0
  countRecording = 0
  dataGames: IDataGame
  isCompleted = false

  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'VAMOS A ESCUCHAR SONIDOS DE "'+this._gameService.currentGame.phoneme+'"',
      subtitle: undefined,
      resource: '',
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }


}
