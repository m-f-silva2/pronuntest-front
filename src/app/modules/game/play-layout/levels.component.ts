import { Component, Input } from '@angular/core';
import { Breadcrumb, LevelBreadcrumb } from 'src/app/core/models/breadcrumb.model';
import { BreadcrumbComponent} from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { RouterOutlet } from '@angular/router';
import { LevelService } from './levels.service';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { Subject, takeUntil } from 'rxjs';
import { Game1Component } from './components/games/game-1/game-1.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [BreadcrumbComponent, Game1Component, RouterOutlet],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {
  @Input() levelBreadcrumb = [<LevelBreadcrumb>{}];
  level = [<Breadcrumb>{}];
  levelStructure: LevelStructure | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _levelService: LevelService){
    this.levelBreadcrumb =[{
      island_name: 'games',
      island_url: '/games',
      island:1,
      level:1
    }];
    this.addBreadcrum()

    this._levelService.levelStructure$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.levelStructure = res
    })
  }

  addBreadcrum() {
    this.level.push({
      label: this.levelBreadcrumb[0].island_name,
      url: this.levelBreadcrumb[0].island_url
    })
    this.levelBreadcrumb.map(bread => {
      this.level.push({
        label: 'isla/'+bread.island+'/nivel/'+bread.level,
        url: bread.island_url+'/island/'+bread.island+'/level/'+bread.level
      });
    });
  }
}
