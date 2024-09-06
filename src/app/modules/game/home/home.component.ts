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
  phonemes = ['p']
  constructor(){
  }

  selectPhoneme(phoneme: string){
    localStorage.setItem('phoneme', phoneme)
  }
}
