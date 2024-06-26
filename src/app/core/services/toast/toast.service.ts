import { Injectable, effect, signal } from '@angular/core';
import { IToast } from './toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toast = signal<IToast|undefined>(undefined);
}