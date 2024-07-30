import { Component, Input } from '@angular/core';
import { Breadcrumb, LevelBreadcrumb } from 'src/app/core/models/breadcrumb.model';
import { BreadcrumbComponent} from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { RouterOutlet } from '@angular/router';
import { GameService } from './game.service';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';


@Component({
  selector: 'app-play-layout',
  standalone: true,
  imports: [BreadcrumbComponent, RouterOutlet, HeaderComponent],
  templateUrl: './play-layout.component.html',
  styleUrl: './play-layout.component.css'
})
export class PlayLayoutComponent {
  @Input() levelBreadcrumb = [<LevelBreadcrumb>{}];
  level = [<Breadcrumb>{}];
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public _gameService: GameService){
    this.levelBreadcrumb =[{
      island_name: 'games',
      island_url: '/games',
      island:1,
      level:1
    }];
    this.addBreadcrum()

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity= res
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
