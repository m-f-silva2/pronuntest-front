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
    {name: 'p', label:'Jugar', hideLock: true, link: '/games/island', styleClass: "-mb-8 block bg-green-600 h-fit z-10 text-2xl relative w-fit px-2 py-1 rounded-xl font-bold text-yellow-50 border-yellow-950 border-2"},
    {name: 'r', label:'', hideLock: false, link: '/games', styleClass: "-mb-8 block bg-gray-500 h-fit z-10 text-2xl relative w-fit px-2 py-1 rounded-xl font-bold text-yellow-50 border-yellow-950 border-2"},
  ]
  constructor(){
  }

  selectPhoneme(phoneme: string){
    localStorage.setItem('phoneme', phoneme)
  }
}
