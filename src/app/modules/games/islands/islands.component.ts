import { Component } from '@angular/core';
import { BtnLevelComponent } from './btn-level.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-islands',
  standalone: true,
  imports: [BtnLevelComponent],
  templateUrl: './islands.component.html',
  styleUrl: './islands.component.css'
})
export class IslandsComponent {
  btns: { state: 'block'|'unlock', island: number, level?: number }[] = [
    { state: 'unlock', island: 1, level: 1 }, 
    { state: 'unlock', island: 1, level: 2 }, 
    { state: 'unlock', island: 1, level: 3 }, 
    { state: 'unlock', island: 1, level: 4 }, 
    { state: 'unlock', island: 1, level: 5 }, 
  ]

  constructor(private _route: Router){

  }

  handleBtnLevel(event: { state: 'block'|'unlock', island?: number, level?: number }){
    this._route.navigateByUrl(`/games/island/${event.island}/level/${event.level}`)
  }
}
