import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';
import { WavRecorder } from "webm-to-wav-converter";

@Component({
  selector: 'app-game-h-surfer',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-h-surfer.component.html',
  styleUrl: './game-h-surfer.component.css'
})
export class GameHSurferComponent {
  /* Nubes saltos */
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  @ViewChild('surfitaIMG') surfitaIMG!: ElementRef<HTMLDivElement>;
  interval: any
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  posCurrentDown = 0
  itemsResources: {id: number, completed: boolean, isCorrect: boolean, img: string, audio: string, yEnd: number, top: number, right:number}[] = []
  allItemsResources: {id: number, completed: boolean, isCorrect: boolean, img: string, audio: string, yEnd: number, top: number, right:number}[][] = [
    [{ id: 0, completed: false, isCorrect: true, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 758,  top: 44, right: 0 }],
    [
      { id: 0, completed: false, isCorrect: true, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 65,  top: 44, right: 0 },
      { id: 2, completed: false, isCorrect: true, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 65,  top: 42, right: 29 },
    ],
    [
      { id: 0, completed: false, isCorrect: true, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 65, top: 44,  right: 0 },
      { id: 2, completed: false, isCorrect: true, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 65, top: 42,  right: 20 },
      { id: 5, completed: false, isCorrect: true, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/fonema_p.wav', yEnd: 65, top: 47, right: -38 },
    ],
  ]
/*   correctItemsResources: {id: number, completed: boolean, isCorrect: boolean, img: string, audio: string, yEnd: 758,  top: -16, right:number}[] = [] */

  sizeCorrectItems = 0;
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _toastGameService: ToastGameService, public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Vamos a escuchar sonidos de la letra ' + this._gameService.structure?.phoneme_type + ' \n\nToca las burbujas que más se parezcan al sonido que escuches',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
    this.isCompleted = false
    this.itemsResources = this.allItemsResources[this.section]
    //this.correctItemsResources = this.allCorrectItemsResources[this.section]
    this.intents = this.itemsResources.length
    this.sizeCorrectItems = this.itemsResources.filter(res=>res.isCorrect).length
  }

  muerteAlFurfista = false
  play() {
    setTimeout(() => {
      //TODO: almacenar clikeados
      //this.handleClickNextAudio(this.itemsResources[this.itemsResources.length - this.sizeCorrectItems].audio)
      this.startRecording()
    }, 400)

    this.isRuning = true
    let count = 0
    this.interval = setInterval(() => {
      this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateX(-${count}%)`);
      count = count + 1
      if (count > 115) {
        this.muerteAlFurfista = true
        clearInterval(this.interval)
        if (this.sizeCorrectItems > 0) {
          /* this.isCompleted = true */
          this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateX(0px)`);
          this._toastService.toast.set({
            type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
              this._toastService.toast.set(undefined)
              this.restart()
            }
          })
        }
      }

      if (this.posCurrentDown < this.itemsResources.length && count > this.itemsResources[this.posCurrentDown].yEnd) {
        this.itemsResources[this.posCurrentDown].completed = true
        this.posCurrentDown++
      }
    }, 500);
  }

  handleClick(btn: number, isCorrect: boolean) {
    this.itemsResources[btn].completed = true

    if (isCorrect) {
      /* this.correctItemsResources[this.correctItemsResources.length - this.sizeCorrectItems].completed = true */
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        this.handleClickNextAudio(this.itemsResources[btn].audio)
        setTimeout(() => {
          this.handleSecondaryAudio(['assets/audios/sonido_excelente.mp3', 'assets/audios/sonido_perfecto.mp3'][Math.floor(Math.random() * 2)])
        }, 100);
      }
    } else {
      this.handleSecondaryAudio('assets/audios/error.mp3')
      this.intents--
    }
    
    /* Determinar si finaliza */
    if (this.sizeCorrectItems == 0 && this.intents > 0) {
      this.restart()
      this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
      setTimeout(() => {
        this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
      }, 700);

      console.log('>> >>: aquí no debe entrar a la primera q', );
      this.isCompleted = true
      this._toastGameService.toast.set({
        type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
          this._toastGameService.toast.set(undefined)
        }
      })
    } else if (this.intents == 0) {
      this.restart()
      this._toastService.toast.set({
        type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
          this._toastService.toast.set(undefined)
        }
      })
    }else{
      setTimeout(() => {
        console.log('>> >>: restart grabación:::: ', );
        this.startRecording()
      }, 500);
    }
  }

  restart() {
    this.isCompleted = false
    clearInterval(this.interval)
    this.renderer.setStyle(this.containerIMG.nativeElement, 'transform', `translateY(0px)`);
    this.itemsResources.forEach(res => res.completed = false)
    //this.correctItemsResources.forEach(res => res.completed = false)
    this.intents = this.itemsResources.length
    this.sizeCorrectItems = this.itemsResources.filter(res=>res.isCorrect).length
    this.audio = ''
    this.muerteAlFurfista = false
    this.i = -1
    this.stopRecording()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  handleClickNextAudio(_audio: string) {
    this.audio = _audio;
    setTimeout(() => {
      (document.getElementById('audio') as HTMLAudioElement).play();
    }, 4);
  }
  
  handleSecondaryAudio(_audio: string) {
    this.audioAux = _audio;
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 2);
  }


  /* ===== Logica audio ===== */

  private mediaRecorder: MediaRecorder | null = null;
  public isRecording = false;
  public audioUrl: string | null = null;
  countRecording = 0
  wavRecorder = new WavRecorder();

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
    this.sendFile(dataFileArrBuf)
  }

  intervalArc: any;
  i:number = -1;
  async stopRecording() {
      this.isRecording = false;
      this.countRecording = 0;
      this.wavRecorder.stop();
      console.log('>> >>: stop');

      if(this.i == 0 || this.i == 3){
        /* this.handleClick(this.i) */
        /* this.i++; */
        /* setTimeout(() => {
          this.i++;
          this._toastService.toast.set({ type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => { 
            this._toastService.toast.set(undefined)
          }})
        }, 1500); */
      }/* else{
        console.log('>> >>: 2', );
        setTimeout(() => {
          this.i = 0;
          this._toastService.toast.set({ type: 's', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo!", end: () => { 
            this._toastService.toast.set(undefined)
          }})
        }, 1500);
      } */
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
    
    console.log('>> >>: startRecording', );
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
    }, 3000);

    this.countRecording = 1
    this.intervalArc = setInterval(() => {
      if (this.countRecording === 0) { return }
      this.countRecording++
      this.setArc({ target: { value: 16.66666666 * (this.countRecording / 100), min: 0, max: 100 } })
    }, 8)
  }

  sendFile(buffer: ArrayBuffer) {
    const boundary = "boundary";
    let body = "";
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="recording"; filename="recording.wav"\r\n`;
    body += `Content-Type: audio/wav\r\n\r\n`;

    const blobBody = this.concatTextToBuffer(buffer, body, `\r\n--${boundary}--\r\n`)
    this._gameService.sendAudio(blobBody, 'a').pipe(takeUntil(this._unsubscribeAll)) .subscribe({ //FIXME: a
      next: (res: any) => {

        this.i++
        this.handleClick(this.i, res.score > 80)

        /* const islandLevel = this._gameService._islandLevels.getValue()?.find(res => res.isl_lev_str_id === this._gameService.structure?.isl_lev_str_id)
        if(!islandLevel) throw new Error('')
        islandLevel.best_accuracy_ia  = res.score
        islandLevel.worst_accuracy_ia = res.score
        this._gameService.updateIslandLevel(islandLevel).subscribe({
          next: (resScoreUpdate: any) => {
            this.i++
            this.handleClick(this.i, resScoreUpdate.score > 80)
          },
          error: (error: any) => {
            this.i++
            console.error('>> >> geterror1:', error);
          }
        }) */
      },
      error: (error: any) => {
        this.i++
        console.error('>> >>  getaudio2:', error);
      }
    });
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

  async getWavBlob() {
    const wavBlob = await this.wavRecorder.getBlob()!

    if (wavBlob) {
      // Convert Blob to byte array (assuming limited library usage)
      const reader = new FileReader();
      reader.readAsArrayBuffer(wavBlob);
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
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

