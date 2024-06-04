import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SpeechTerapyComponent } from './components/speech-terapy/speech-terapy.component';
import { AdminComponent } from './components/admin/admin.component';

export default [
  { path: '', component: DashboardComponent,
    children: [
      { path: 'speech-therapy', component: SpeechTerapyComponent },
      { path: 'admin', component: AdminComponent },
      { path: '**', component: SpeechTerapyComponent },
    ]
  },
] as Routes;