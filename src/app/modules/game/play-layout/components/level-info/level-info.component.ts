import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';
import { GameService } from '../../game.service';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';

@Component({
  selector: 'app-level-info',
  standalone: true,
  imports: [BtnImgComponent],
  templateUrl: './level-info.component.html',
  styleUrl: './level-info.component.css'
})
export class LevelInfoComponent {
  @Input() data?: { title?: string, subtitle?: string, resource?: string, next?: string, previous?: string }
  @Output() btnsEvent = new EventEmitter<'endNext' | 'previous' | 'firstPrevious' | 'next'>();
  resourceUrl: SafeResourceUrl = '';
  isExternalSrc = false;
  sumaryActivity: SumaryActivities | undefined
  infoP = false
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private sanitizer: DomSanitizer, public _gameService: GameService) {
    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.infoP = this._gameService.currentGame.posLevel === 0
    })
  }

  ngOnInit() {
    this.isExternalSrc = this.data?.resource ? this.data.resource.startsWith('h') : false
    if (this.isExternalSrc) {
      this.resourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data?.resource || '');
    }
  }

  handleBtn(typeDirection: 'endNext' | 'previous' | 'firstPrevious' | 'next') {
    this.btnsEvent.emit(typeDirection)
  }
  
  nextInfoP() {
    this.infoP = false
  }

}
