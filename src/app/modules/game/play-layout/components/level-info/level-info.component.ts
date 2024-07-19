import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-level-info',
  standalone: true,
  imports: [],
  templateUrl: './level-info.component.html',
  styleUrl: './level-info.component.css'
})
export class LevelInfoComponent {
  @Input() data?: {title?: string, subtitle?: string, image?: string, next?: string, previous?: string }
  @Output() btnsEvent = new EventEmitter<'endNext'|'previous'|'firstPrevious'|'next'>();

  constructor(){}

  handleBtn(typeDirection: 'endNext'|'previous'|'firstPrevious'|'next') {
    this.btnsEvent.emit(typeDirection)
  }
}
