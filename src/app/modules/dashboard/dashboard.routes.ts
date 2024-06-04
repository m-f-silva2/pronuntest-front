import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SpeechTherapyComponent } from './pages/speech-therapy/speech-therapy.component';
import { AdminComponent } from './pages/admin/admin.component';


export default [
  { path: '', component: DashboardComponent,
    children: [
      { path: 'speech-therapy', component: SpeechTherapyComponent },
      { path: 'admin', component: AdminComponent },
      { path: '**', component: SpeechTherapyComponent },
    ]
  },
] as Routes;