import { Component } from '@angular/core';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { GameService } from '../../game.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public _gameService: GameService, private _route: Router){
    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity= res
    })
  }
  createArrayFromNumber(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i);
  }

  goIslands(){
    this._route.navigateByUrl(`/games/island`)
  }
}
