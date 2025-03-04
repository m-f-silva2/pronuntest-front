import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudiosManagerService {
  private apiUrl = 'https://tuapi.com/audios'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  getPatientAudios(): Observable<any> {
    // Datos simulados
    const data = [
      {
        user_id: 1,
        name: 'Juan Pérez',
        audios: [
          { fileName: 'palabra1.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'palabra2.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'palabra3.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'palabra4.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'palabra5.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'palabra6.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'palabra7.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
        ]
      },
      {
        user_id: 2,
        name: 'María López',
        audios: [
          { fileName: 'ejemplo1.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'ejemplo2.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'ejemplo3.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'ejemplo4.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'ejemplo5.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'ejemplo6.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { fileName: 'ejemplo7.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
        ]
      }
    ];

    return of(data); // Simula una API devolviendo datos como Observable
  }

  downloadAudio(audioUrl: string, fileName: string) {
    fetch(audioUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error('Error al descargar el audio', error));
  }
}
