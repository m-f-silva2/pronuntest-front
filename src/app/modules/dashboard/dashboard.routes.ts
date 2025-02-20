import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SpeechTherapyComponent } from './pages/speech-therapy/speech-therapy.component';
import { AdminComponent } from './pages/admin/admin.component';
import { IslandManagerComponent } from './pages/island-manager/island-manager.component';


export default [
  { path: '', component: DashboardComponent,
    children: [
      { path: 'speech-therapy', component: SpeechTherapyComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'island-manager', component: IslandManagerComponent },
      { path: '**', component: SpeechTherapyComponent },
    ]
  },
] as Routes;