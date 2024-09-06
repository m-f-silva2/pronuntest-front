import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  phonemes = [
    {name: 'pa', label:'Jugar', hideLock: true, link: '/games/island'},
    {name: 'r', label:'', hideLock: false, link: '/games'},
  ]
  constructor(){
  }

  selectPhoneme(phoneme: string){
    localStorage.setItem('phoneme', phoneme)
  }
}
