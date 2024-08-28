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
  phonemes = ['pa','pe','pi','po','pu','pie','pollo','pulpo','palo','papa','mapa','pelo','pila','lupa','puma','pino','pan']
  constructor(){
  }
}
