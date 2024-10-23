import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IToast {type: 's'|'i'|'w'|'loading', timeS?: number, title?: string, message?: string, end?: () => void } 

@Component({
  selector: 'toast-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-game.component.html',
  styleUrls: ['./toast-game.component.scss'],
})
export class ToastGameComponent {
  @Input() data?: IToast
  color: {
    s: { color: string, icon: string },
    i: { color: string, icon: string },
    w: { color: string, icon: string },
  } = {
    s: { color: "#2BDE3F", icon: '/assets/success.svg' },
    i: { color: "#1D72F3", icon: '/assets/info.svg' },
    w: { color: "#FFC007", icon: '/assets/warning.svg'},
  }
  
  ngOnChanges(){
    if(!this.data?.timeS) return
    setTimeout(() => {
      this.data?.end!()
    }, this.data?.timeS*1000);
  }
}
/* toast?: IToast 
this.toast = { type: 's', timeS: 1.8, title: "Exitoso", message: "Datosborrados", end: () => { this.toast = undefined } }
@if (toast) {<toast [data]="toast"></toast>} 
*/
