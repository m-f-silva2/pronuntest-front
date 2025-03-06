import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BtnImgComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  phonemes = [
    {name: 'p', label:'Jugar', hideLock: true, link: '/games/island', styleClass: "m-auto block h-fit z-10 text-2xl relative w-fit px-2 py-1 rounded-xl border-2"},
    {name: 'r', label:'', hideLock: false, link: '/games', styleClass: "m-auto block bg-gray-500 h-fit z-10 text-2xl relative w-fit px-2 py-1 rounded-xl border-2"},
  ]
  constructor(){
  }

  selectPhoneme(phoneme: string){
    localStorage.setItem('phoneme', phoneme)
  }
  downloadFile() {
    const fileUrl = "https://drive.google.com/uc?export=download&id=1L8VLdm0XfjlsEVKM8C5dTZI0pQMgiZzW";
    const fileName = "speakCheckVocales.zip"; // Puedes cambiar el nombre del archivo
  
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error("Error descargando el archivo:", error));
  }
  
}
