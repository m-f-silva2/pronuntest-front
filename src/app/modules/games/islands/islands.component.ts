import { Component } from '@angular/core';
import { BtnLevelComponent } from './btn-level.component';

@Component({
  selector: 'app-islands',
  standalone: true,
  imports: [BtnLevelComponent],
  templateUrl: './islands.component.html',
  styleUrl: './islands.component.css'
})
export class IslandsComponent {
  btns: { state: 'block'|'unlock', level?: number }[] = [
    { state: 'unlock', level: 1 }, 
    { state: 'unlock', level: 2 }, 
    { state: 'unlock', level: 3 }, 
    { state: 'unlock', level: 4 }, 
    { state: 'unlock', level: 5 }, 
  ]

  handleBtnLevel(event: { state: 'block'|'unlock', level?: number }){
    console.log('>> >>  eventxxxxx:', event);
  }
}
