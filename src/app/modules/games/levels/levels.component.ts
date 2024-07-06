import { Component, Input } from '@angular/core';
import { Breadcrumb, LevelBreadcrumb } from 'src/app/core/models/breadcrumb.model';
import { BreadcrumbComponent} from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { LevelInfoComponent } from '../components/level/level-info/level-info.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [BreadcrumbComponent, LevelInfoComponent],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {
  @Input() levelBreadcrumb = [<LevelBreadcrumb>{}];
  level = [<Breadcrumb>{}];

  constructor(){
    this.levelBreadcrumb =[{
      island_name: 'games',
      island_url: '/games',
      island:1,
      level:1
    }];
    this.addBreadcrum()
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
