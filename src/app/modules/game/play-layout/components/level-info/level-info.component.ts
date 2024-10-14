import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-level-info',
  standalone: true,
  imports: [BtnImgComponent],
  templateUrl: './level-info.component.html',
  styleUrl: './level-info.component.css'
})
export class LevelInfoComponent {
  @Input() data?: {title?: string, subtitle?: string, resource?: string, next?: string, previous?: string }
  @Output() btnsEvent = new EventEmitter<'endNext'|'previous'|'firstPrevious'|'next'>();

  constructor(){}

  handleBtn(typeDirection: 'endNext'|'previous'|'firstPrevious'|'next') {
    this.btnsEvent.emit(typeDirection)
  }
}
