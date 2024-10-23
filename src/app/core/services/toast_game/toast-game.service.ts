import { Injectable, effect, signal } from '@angular/core';
import { IToast } from './toast-game.component';

@Injectable({
  providedIn: 'root'
})
export class ToastGameService {
  public toast = signal<IToast|undefined>(undefined);
}