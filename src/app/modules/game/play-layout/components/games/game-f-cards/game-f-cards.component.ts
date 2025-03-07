import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';
import { WavRecorder } from "webm-to-wav-converter";

@Component({
  selector: 'app-game-f-cards',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-f-cards.component.html',
  styleUrl: './game-f-cards.component.css'
})
export class GameFCardsComponent {
  /* Cartas */
  sumaryActivity: SumaryActivities | undefined
  autoplay = false
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  mode: 'front'|'back'|null = null
  isRuning = false
  sizeCorrectItems = 0
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  itemsResources: { id: number, completed: boolean, img: string, audio: string, active: boolean, phonema: string   , correctItem: boolean }[] = []
  allItemsResources: { id: number, completed: boolean, img: string, audio: string, active: boolean, phonema: string, correctItem: boolean }[][] = [
    [],
    [
      { id: 0, completed: false, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/po.mp3', active: false, phonema: 'po', correctItem: true },
      { id: 1, completed: false, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/pe.mp3', active: false, phonema: 'pe', correctItem: false },
      { id: 1, completed: false, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/pi.mp3', active: false, phonema: 'pi', correctItem: false },
      { id: 1, completed: false, img: 'assets/images/isla1/topo.webp', audio: 'assets/audios/po.mp3', active: false, phonema: 'po', correctItem: true },
    ],
    [
      { id: 2, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/pa.mp3', active: false, phonema: 'pa', correctItem: false},
      { id: 3, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/pe.mp3', active: false, phonema: 'pe', correctItem: false},
      { id: 4, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/pi.mp3', active: false, phonema: 'pi', correctItem: false},
      { id: 5, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/po.mp3', active: false, phonema: 'po', correctItem: true},
      { id: 6, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/pu.mp3', active: false, phonema: 'pu', correctItem: false},
      { id: 7, completed: false, img: 'assets/images/isla0/globo.svg', audio: 'assets/audios/po.mp3', active: false, phonema: 'po', correctItem: true},
    ],
    [
      { id: 8, completed: false,  img: 'assets/images/isla2/pelo.webp', audio: 'assets/audios/pelo.mp3', active: false, phonema: 'pelo', correctItem: true },
      { id: 9, completed: false,  img: 'assets/images/isla2/pila.webp', audio: 'assets/audios/pila.mp3', active: false, phonema: 'pila', correctItem: true },
      { id: 10, completed: false, img: 'assets/images/isla2/pino.webp', audio: 'assets/audios/pino.mp3', active: false, phonema: 'pino', correctItem: true },
      { id: 11, completed: false, img: 'assets/images/isla2/pollo.webp', audio:'assets/audios/pollo.mp3',active: false, phonema: 'pollo', correctItem: true },
      { id: 12, completed: false, img: 'assets/images/isla2/puma.webp', audio: 'assets/audios/puma.mp3', active: false, phonema: 'puma', correctItem: true },
      { id: 13, completed: false, img: 'assets/images/isla2/palo.webp', audio: 'assets/audios/palo.mp3', active: false, phonema: 'palo', correctItem: true },
    ],
  ]
  //TODO: audio: Que imagen suena como [variable]

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
  randomOrder: number[] = []

  constructor(private readonly _toastGameService: ToastGameService, public _gameService: GameService, private readonly _toastService: ToastService, private readonly ref: ChangeDetectorRef) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Encuentra la pareja que coincida con el sonido.',
      subtitle: undefined,
      resource: "https://www.youtube.com/embed/srwExUfTfM0?si=HsRl7h23iOUd17XM&amp;start=0&autoplay=1",
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })
    if(this._gameService.currentGame.posIsland === 2 && (this._gameService.currentGame.posLevel === 2 || this._gameService.currentGame.posLevel === 3)){
      this.mode = 'front'
    }else{
      this.mode = 'back'
    }

  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
    /* this.section = this.section < 2 && this.mode == 'front'? this.section : 1 */
    this.initData()
  }

  initData() {
    const sectionMode = this.mode == 'front'? this.section + 2 : this.section
    this.itemsResources = [...this.allItemsResources[sectionMode]]
    this.randomOrder = [...Array(this.itemsResources.length)].map((_, index) => index+1).sort(() => Math.random() - 0.5);

    this.isCompleted = false
    this.sizeCorrectItems = this.itemsResources.filter(res=>res.correctItem === true).length || 0
    this.intents = this.itemsResources.length-1 || 0
    this.audio = ''
    this.itemsResources?.forEach(res => res.completed = false)
  }

  intervalTopo: any
  play() {
    this.initData()
    this.isRuning = true
    setTimeout(() => {
      this.handleClickNextAudio(this.itemsResources[this.sizeCorrectItems-1].audio)
    }, 380)


    /* this.intervalTopo = setInterval(() => {
      const randomPos = Math.floor(Math.random() * this.itemsResources.length)
      if(this.itemsResources[randomPos].active == false){
        this.itemsResources[randomPos].active = true
        setTimeout(() => {
          if(!this.itemsResources[randomPos]) return
          this.itemsResources[randomPos].active = false
        }, 2780);
      }
    }, 300); */
  }
  restart() {
    this.autoplay = false;
    clearInterval(this.intervalTopo)
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  openMicrophone = false
  handleClick(btn: number) {
    if ((this.itemsResources[btn].correctItem && this.mode === 'back') 
      || (this.itemsResources[btn].id == this.itemsResources[this.sizeCorrectItems-1].id && this.mode === 'front')) {
        this.itemsResources[btn].completed = true;
      this.sizeCorrectItems--
      //Calcular tiempo del sonido del objeto tocado y las felicitaciones
      if (this.sizeCorrectItems != 0) {
        setTimeout(() => {
          this.handleSecondaryAudio(['assets/audios/sonido_excelente.mp3', 'assets/audios/sonido_perfecto.mp3'][Math.floor(Math.random() * 2)])
        }, 10);
        if(!(this._gameService.currentGame.posIsland === 2 && this._gameService.currentGame.posLevel === 3)){
          setTimeout(() => {
            this.handleClickNextAudio(this.itemsResources[this.sizeCorrectItems-1]?.audio)
          }, 900);
        }
      }

      if(this._gameService.currentGame.posIsland === 2 && this._gameService.currentGame.posLevel === 3){
        this.openMicrophone = true;
        setTimeout(() => {
          this.startRecording()
        }, 500);
        return
      }
    } else {
      this.handleSecondaryAudio('assets/audios/error.mp3')
      this.intents--
    }

    if (this.sizeCorrectItems == 0 && this.intents > 0) {
      this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
      setTimeout(() => {
        this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
        this.restart()
        this.isCompleted = true
        this._toastGameService.toast.set({
          type: 's', timeS: 3, title: "Ganaste!", message: "Nivel completado con exito!", end: () => {
            this._toastGameService.toast.set(undefined)
          }
        })
      }, 500);

    } else if (this.intents == 0) {
      this.restart()
      this._toastService.toast.set({
        type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
          this._toastService.toast.set(undefined)
        }
      })
    }
  }

  handleClickNextAudio(_audio: string) {
    this.audio = _audio;
    setTimeout(() => {
      if(this.audio){
        (document.getElementById('audio') as HTMLAudioElement).play();
      }
    }, 4);
  }

  handleSecondaryAudio(_audio: string) {
    this.audioAux = _audio;
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 2);
  }



  /* ===== Logica audio ===== */
  omit(): void {
    this.i = 0;
    this.openMicrophone = false;
    this.intents--;
    this.handleClickNextAudio(this.itemsResources[this.sizeCorrectItems-1]?.audio)
  }

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
    this.openMicrophone = true;
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
    this._gameService.sendAudio(blobBody, this.itemsResources[this.sizeCorrectItems]?.phonema).pipe(takeUntil(this._unsubscribeAll)) .subscribe({ //FIXME: a
      next: (res: any) => {

        this.i++
        /* this.handleClick(this.i, res.score > 80) */
        if(res.score > -1){
          this.openMicrophone = false;
          
          
          this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
          if (this.sizeCorrectItems == 0 && this.intents > 0) {
            this.handleSecondaryAudio('assets/audios/gritos_ganaste.mp3')
            setTimeout(() => {
              this.handleClickNextAudio('assets/audios/sonido_ganaste.mp3')
              this.restart()
              this.isCompleted = true
              this._toastGameService.toast.set({
                type: 'finish', timeS: 3, title: "¡ISLA COMPLETADA!", message: "¡Increíble! Has completado toda la isla!", end: () => {
                  this._toastGameService.toast.set(undefined)
                  window.location.href = '/games/island';
                }
              })
            }, 500);
            
          } else{
            this.handleClickNextAudio(this.itemsResources[this.sizeCorrectItems-1]?.audio)
          }
        }else{
          /* this.intents-- */
          if (this.intents == 0) {
            this.restart()
            this._toastService.toast.set({
              type: 'w', timeS: 3, title: "Perdiste!", message: "Vuelve a intentarlo", end: () => {
                this._toastService.toast.set(undefined)
              }
            })
          }
          this.handleSecondaryAudio('assets/audios/error.mp3')
        }


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
        } else {
          console.error("Error reading audio data");
        }
        this.ref.detectChanges();
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

