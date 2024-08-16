import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { WavRecorder } from "webm-to-wav-converter";

@Component({
  selector: 'app-game-1',
  standalone: true,
  imports: [LevelInfoComponent],
  templateUrl: './game-1.component.html',
  styleUrl: './game-1.component.css'
})
export class Game1Component {
  sumaryActivity: SumaryActivities | undefined
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections = [{
    title: 'VAMOS A PRONUNCIAR LA PALABRA POLLO',
    subtitle: undefined,
    image: 'string',
    next: '1',
    previous: undefined
  }]
  section = 0
  countRecording = 0
  dataGames: IDataGame
  isCompleted = false
  wavRecorder = new WavRecorder();

  constructor(private _gameService: GameService, private ref: ChangeDetectorRef, private router: Router) {
    this.dataGames = this._gameService.dataGames

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }


  private mediaRecorder: MediaRecorder | null = null;
  public isRecording = false;
  public audioUrl: string | null = null;

  async getFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (): void => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.onerror = (error: any) => {
          console.error('>> >>  error reader file:', error);
          reject();
        };
      } catch (e) {
        reject();
      }
    });
  }

  async file(event: any) {
    const file = event.files[0] as File
    const dataFileArrBuf = await this.getFileToArrayBuffer(file)
    await this.sendFile(dataFileArrBuf)
  }

  intervalArc: any
  async stopRecording() {
      this.isRecording = false;
      this.countRecording = 0
      this.wavRecorder.stop();
  }

  async getWavBlob() {
    const wavBlob = await this.wavRecorder.getBlob()!

    if (wavBlob) {
      // Convert Blob to byte array (assuming limited library usage)
      const reader = new FileReader();
      reader.readAsArrayBuffer(wavBlob);
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          this.isCompleted = true
          this.sendFile(event.target.result as ArrayBuffer)
          this.audioUrl = URL.createObjectURL(wavBlob);
          this.ref.markForCheck();

        } else {
          console.error("Error reading audio data");
        }
      };


      // Puedes usar el Blob como quieras, por ejemplo, subirlo a un servidor
    } else {
      console.error('No se pudo obtener el Blob WAV');
    }
  }

  async startRecording() {
    if (this.isRecording) {
      this.stopRecording()
      return
    }
    const started = await this.wavRecorder.start();
    if (!started) {
      console.error('No se pudo iniciar la grabación');
      return
    }

    const stream = this.wavRecorder.stream
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.onstop = () => {
      this.getWavBlob()
    };


    this.mediaRecorder.start();
    this.isRecording = true;
    this.setArc({ target: { value: 0, min: 0, max: 100 } })


    setTimeout(() => {
      this.stopRecording()
      this.countRecording = 0
    }, 6000);

    this.countRecording = 1
    this.intervalArc = setInterval(() => {
      if (this.countRecording === 0) { return }
      this.countRecording++
      this.setArc({ target: { value: 16.66666666 * (this.countRecording / 100), min: 0, max: 100 } })
    }, 10)

  }

  concatTextToBuffer(buffer: ArrayBuffer, textBefore: string, textAfter: string): ArrayBuffer {
    // Convertir texto a ArrayBuffer utilizando el encoding especificado
    const textBeforeBuffer = new TextEncoder().encode(textBefore);
    const textAfterBuffer = new TextEncoder().encode(textAfter);
  
    // Calcular el tamaño total del nuevo buffer
    const totalLength = textBeforeBuffer.byteLength + buffer.byteLength + textAfterBuffer.byteLength;
  
    // Crear un nuevo ArrayBuffer
    const newBuffer = new ArrayBuffer(totalLength);
    const newUint8Array = new Uint8Array(newBuffer);
    const originalBuffer = new Uint8Array(buffer);

    // Copiar los datos al nuevo ArrayBuffer
    newUint8Array.set(textBeforeBuffer);
    newUint8Array.set(originalBuffer, textBeforeBuffer.byteLength);
    newUint8Array.set(textAfterBuffer, textBeforeBuffer.byteLength + buffer.byteLength);
  
    return newBuffer;
  }

  sendFile(buffer: ArrayBuffer) {
    const boundary = "boundary";
    let body = "";
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="recording"; filename="recording.wav"\r\n`;
    body += `Content-Type: audio/wav\r\n\r\n`;

    /* const audioWAB8Array = new Uint8Array(buffer); */
    /* const numbers: number[] = [];
    for (const byte of audioWAB8Array) {
      numbers.push(byte);
    } */
   /* body += String.fromCharCode.apply(null, numbers);
   body += `\r\n--${boundary}--\r\n`; */

    const blobBody = this.concatTextToBuffer(buffer, body, `\r\n--${boundary}--\r\n`)
    

    this._gameService.sendAudio(blobBody).subscribe({
      next: (res: any) => {
        console.log('>> >>  audio res:', res);
      },
      error: (error: any) => {
        console.error('>> >>  audio error:', error);
      }
    });
  }


  setArc(event: { target: { value: number, min: number, max: number } }) {
    const spinner = document.querySelector('.spinner')! as HTMLElement
    const line = spinner.querySelector('.line')! as SVGGeometryElement

    const pathLength = line.getTotalLength()
    const radius = Number(line.getAttribute('r'))
    const piR2 = 2 * Math.PI * radius
    const { value, min, max } = event.target


    const val = value  //parseInt(value, 10)
    const length = Math.abs(((val / max) * piR2) / pathLength).toFixed(2)
    /* const percent = ((value - min) / (max - min) * 100) */

    spinner.style.setProperty('--stroke-dasharray', `${length} 1`)
    spinner.style.setProperty('--stroke-dashoffset', val < 0 ? (Number(length) * 2) + '' : '0')
    spinner.style.setProperty('--stroke-timing', val === 0 ? '0ms' : '300ms')
  }

}
