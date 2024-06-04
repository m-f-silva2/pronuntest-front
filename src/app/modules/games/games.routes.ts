import { Routes } from '@angular/router';
import { IslandsComponent } from './islands/islands.component';
import { LevelsComponent } from './levels/levels.component';
import { ActivitiesComponent } from './activities/activities.component';

export default [
  { path: '', component: IslandsComponent,
    children: [
      { path: 'games/island/:island', component: LevelsComponent },
      { path: 'games/island/:island/:level', component: ActivitiesComponent },
      { path: '**', component: IslandsComponent },
    ]
  },
] as Routes;