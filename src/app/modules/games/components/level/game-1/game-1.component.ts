import { Component, ElementRef, ViewChild } from '@angular/core';
import { LevelService } from '../../../levels/levels.service';
import { Subject, takeUntil } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-game-1',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-1.component.html',
  styleUrl: './game-1.component.css'
})
export class Game1Component {
  levelStructure: LevelStructure | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections = [{
    title: 'VAMOS A ESCUCHAR SONIDOS DE LA LETRA P',
    subtitle: 'El sonido de la letra p es igual cuando escuchamos reventar un globo',
    image: 'string',
    next: '1',
    previous: undefined
  }]
  section = 0
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement> | undefined;

  
  constructor(private _levelService: LevelService, private router: Router) {
    this._levelService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }
  
  btnsEvent(event: { value?: string | undefined; type: 'nextLevel'|'previous'|'next'; }) {
    if(event.type === 'nextLevel'){
      const level = Number(event.value)
      const validate = this._levelService.dataGames.islands[this.levelStructure!.isl_id!-1].levels[level]
      if(!validate) return
      this.router.navigateByUrl(`/games/island/${this.levelStructure!.isl_id!}/level/${level+1}`)
    }else{
      this.section = Number(event.value)
    }
  }

  handlePlay(){
    this.audio?.nativeElement.play()
  }
}
