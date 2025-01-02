import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { IDataGame, GameService } from '../../../game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { allItemsResourcesHistory, RECORDS_ALL } from './history-data';
import { WavRecorder } from "webm-to-wav-converter";
import { SupabaseService } from 'src/app/core/services/supabase/supabase.service';

@Component({
  selector: 'app-game-k-history',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-k-history.component.html',
  styleUrl: './game-k-history.component.css'
})
export class GameKHistoryComponent {
  /* history */
  sumaryActivity: SumaryActivities | undefined
  sections: any[] = []
  section = 0
  dataGames: IDataGame
  isCompleted = false
  isRuning = false
  sizeCorrectItems = 0
  frameClass = ''
  intents = 5;
  audio: string = '';
  audioAux: string = '';
  wavRecorder = new WavRecorder();
  
  itemsResources: { img: string, class: string, styles: string }[] = []
  allItemsResources: { img: string, class: string, styles: string }[][] = allItemsResourcesHistory
  recordsAll = RECORDS_ALL
  records: { audio: string, myRecord: any, approved: boolean, start: number, end: number }[] = []
  currentRecord: { audio: string, myRecord: any, approved: boolean, start: number, end: number } | undefined

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private readonly _toastGameService: ToastGameService, public _gameService: GameService, private readonly _toastService: ToastService
, private ref: ChangeDetectorRef, private supabaseService: SupabaseService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Vamos a contar una historia.',
      subtitle: undefined,
      resource: '/assets/video/explosion.mp4',
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })

  }

  async uploadAudio(): Promise<void> {
    if (this.currentRecord?.myRecord) {
      try {
        const audioBlob = await fetch(this.currentRecord.myRecord).then(res => res.blob());
        const audioFile = new File([audioBlob], 'audio_record.wav', { type: 'audio/wav' });
        const uploadResponse = await this.supabaseService.uploadAudio(audioFile);
        console.log('Audio uploaded successfully:', uploadResponse);
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }
  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
    this.initData()
  }

  initData() {
    this.isCompleted = false
    this.allItemsResources.forEach((list, i) => {
      list.forEach(res => {
        if (i === 1) {
          res.class = 'entryAbove';
        } else {
          res.class = '';
        }
      });
    });

    this.sizeCorrectItems = this.allItemsResources.length - 1 //this.correctItemResource?.sizeCorrectItems || 0
    this.itemsResources = this.allItemsResources[this.allItemsResources.length - this.sizeCorrectItems]
    this.records = this.recordsAll[this.allItemsResources.length - this.sizeCorrectItems]
    this.currentRecord = this.records[0]
    this.audio = ''
    /* this.itemsResources.forEach(res => res.completed = false) */
  }

  intervalTopo: any
  play() {
    this.initData()
    this.isRuning = true

    setTimeout(() => {
      this.itemsResources[0].class = 'exitLeft';
      this.itemsResources[1].class = 'exitRight';
      this.handleClickNextAudio('assets/audios/historia-1-001.mp3');
    }, 180)
  }
  restart() {
    clearInterval(this.intervalTopo)
    this.initData()
    setTimeout(() => {
      this.isRuning = false;
    }, 1000);
  }

  handleClick(btn: number) {
    this.sizeCorrectItems--;
    //Calcular tiempo del sonido del objeto tocado y las felicitaciones
    this.itemsResources.forEach((res, i) => {
      res.class = i % 2 === 0 ? 'exitLeft' : 'exitRight'
    });
    this.itemsResources = this.allItemsResources[this.allItemsResources.length - this.sizeCorrectItems]
    this.records = this.recordsAll[this.allItemsResources.length - this.sizeCorrectItems]
    this.currentRecord = this.records.find(r => !r.approved)
    
    if (this.sizeCorrectItems != 0) {
      this.itemsResources.forEach((res, i) => res.class = 'entryAbove');
      setTimeout(() => {
        console.log('>> >>: siguiente audio', (this.allItemsResources.length - this.sizeCorrectItems));
        this.audio='';
        this.handleClickNextAudio('assets/audios/historia-1-00'+(this.allItemsResources.length - this.sizeCorrectItems)+'.mp3');
      }, 50);
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

    }
  }

  handleClickNextAudio(_audio: string) {
    this.audio = _audio;
    this.ref.detectChanges();
    setTimeout(() => {
      (document.getElementById('audio') as HTMLAudioElement).play();
    }, 10);
  }

  handleSecondaryAudio(_audio: string) {
    this.audioAux = _audio;
    this.ref.detectChanges();
    setTimeout(() => {
      (document.getElementById('audioAux') as HTMLAudioElement).play();
    }, 10);
  }

  rangeAudio(_audio: string, start: number, end: number) {
    this.audio = _audio;
    this.ref.detectChanges();
    setTimeout(() => {
      const audioEl = document.getElementById('audio') as HTMLAudioElement
      audioEl.currentTime = start
      audioEl.play();

      audioEl.addEventListener('timeupdate', function onTimeUpdate() {
        if (audioEl.currentTime >= end) {
          audioEl.pause();
          audioEl.removeEventListener('timeupdate', onTimeUpdate);
        }
      });
    }, 5);
  }

  handleApproved(validation: boolean){
    this.currentRecord!.approved = validation
    if(!validation){
      this.currentRecord!.myRecord = null
    }else{
      this.currentRecord = this.records.find(r => !r.approved)
      if(!this.currentRecord){
        this.handleClick(0);
      }
      this.ref.detectChanges();
    }
  }

  /* Grabar */
  private mediaRecorder: MediaRecorder | null = null;
  public isRecording = false;
  
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
    /* await this.sendFile(dataFileArrBuf) */
  }

  intervalArc: any;
  i:number = 0;
  async stopRecording() {
      this.isRecording = false;
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
          this.currentRecord!.myRecord = URL.createObjectURL(wavBlob);

          this.ref.detectChanges();
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
    this.ref.detectChanges();
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
}

