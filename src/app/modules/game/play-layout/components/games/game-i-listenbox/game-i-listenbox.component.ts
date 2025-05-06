import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from '../../../../../../core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { BtnImgComponent } from '../../../../../../shared/components/btn-img/btn-img.component';
import { ToastGameService } from '../../../../../../core/services/toast_game/toast-game.service';
import { ConffetyComponent } from '../../conffety/conffety.component';

@Component({
  selector: 'app-game-i-listenbox',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule, BtnImgComponent, ConffetyComponent],
  templateUrl: './game-i-listenbox.component.html',
  styleUrl: './game-i-listenbox.component.css'
})
export class GameIListenboxComponent {
  /* box - selecciona caja */
  sumaryActivity: SumaryActivities | undefined
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
  autoplay = false
  sections: any[] = []
  dataGames: IDataGame
  sounds = [false, false, false]
  isCompleted = false
  section = 0
  countRecording = 0
  itemsResources: { img: string,  audioL: string, audioR: string, boxExplosion: 0|1, l: string, r: string }[] = [
    { img: 'assets/images/isla2/lupa.webp',  audioL: 'assets/audios/lu.mp3', audioR: 'assets/audios/pa.mp3', boxExplosion: 1, l: "lu", r: "pa" },
    { img: 'assets/images/isla2/mapa.webp',  audioL: 'assets/audios/ma.mp3', audioR: 'assets/audios/pa.mp3', boxExplosion: 1, l: "ma", r: "pa" },
    { img: 'assets/images/isla2/palo.webp',  audioL: 'assets/audios/pa.mp3', audioR: 'assets/audios/lo.mp3', boxExplosion: 0, l: "pa", r: "lo" },
    { img: 'assets/images/isla2/pelo.webp',  audioL: 'assets/audios/pe.mp3', audioR: 'assets/audios/lo.mp3', boxExplosion: 0, l: "pe", r: "lo" },
    { img: 'assets/images/isla2/pila.webp',  audioL: 'assets/audios/pi.mp3', audioR: 'assets/audios/la.mp3', boxExplosion: 0, l: "pi", r: "la" },
    { img: 'assets/images/isla2/pino.webp',  audioL: 'assets/audios/pi.mp3', audioR: 'assets/audios/no.mp3', boxExplosion: 0, l: "pi", r: "no" },
    { img: 'assets/images/isla2/pollo.webp', audioL: 'assets/audios/po.mp3', audioR: 'assets/audios/yo.mp3', boxExplosion: 0, l: "po", r: "llo" },
    { img: 'assets/images/isla2/puma.webp', audioL: 'assets/audios/pu.mp3', audioR: 'assets/audios/ma.mp3', boxExplosion: 0, l: "pu", r: "ma" },
  ]
  itemsResourcesPos = -1
  audio: string = '';
  audioAux: string = '';
  isRuning = false
  explosion = false

  @ViewChild('boxA') boxA!: ElementRef<HTMLDivElement>;
  @ViewChild('boxB') boxB!: ElementRef<HTMLDivElement>;
  dropsArea = {
    a: { x: 0, y: 0, h: 0, w: 0 },
    b: { x: 0, y: 0, h: 0, w: 0 }
  }
  position = { x: 0, y: 0 };
  private touchStart = { x: 0, y: 0 };

  mousemoveEvent: any;
  mouseupEvent: any;
  movedElement: any;
  offsetX = 0;
  offsetY = 0;
  curX: number = 0;
  curY: number = 0;
  xStartElementPoint: number = 0;
  yStartElementPoint: number = 0;
  xStartMousePoint: number = 0;
  yStartMousePoint: number = 0;

  constructor(private readonly renderer: Renderer2, private readonly _toastGameService: ToastGameService, public _gameService: GameService, private readonly _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames
    this.sections.push({
      title: 'Vamos a ubicar en que posición se haya la explosión en la palabra.',
      subtitle: undefined,
      resource: "https://www.youtube.com/embed/-N2CsTZ_UDg?si=sFDZtXtdbipl73PI&amp;start=0&autoplay=1",
      next: '1',
      previous: undefined
    })

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res
    })
    this.itemsResources = this.shuffleArray(this.itemsResources);

    this.itemsResourcesPos = 0;
  }

  /* ================================ MOVE =============================================== */
  startDrag(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('drag')) return false;
    this.movedElement = this.renderer.selectRootElement(target, true);
    this.setInitialAbsolutePos(this.movedElement);
    this.xStartMousePoint = event.pageX;
    this.yStartMousePoint = event.pageY;
    this.mousemoveEvent = this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
    this.mouseupEvent = this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
    this.xStartElementPoint = this.curX;
    this.yStartElementPoint = this.curY;
    return true;
  }

  onMouseMove(event: any): boolean {
    this.curX = this.xStartElementPoint + (event.pageX - this.xStartMousePoint + this.offsetX);
    this.curY = this.yStartElementPoint + (event.pageY - this.yStartMousePoint + this.offsetY);
    this.moveElement(this.movedElement, this.curX, this.curY);

    return false;
  }

  onMouseUp(): boolean {
    // Remove listeners
    this.mousemoveEvent();
    this.mouseupEvent();
    this.isInsideDropZone();
    return false;
  }

  moveElement(element: any, curX: number, curY: number): void {
    // update the position of the div:
    this.renderer.setStyle(element, 'left', curX + 'px');
    this.renderer.setStyle(element, 'top', curY + 'px');
    this.renderer.setStyle(element, 'right', 'initial'); // required in case the element was previously right-aligned...
    this.renderer.setStyle(element, 'bottom', 'initial'); // required in case the element was previously bottom-aligned...
  }

  setInitialAbsolutePos(element: any): void {
    this.curX = element.getBoundingClientRect().left;
    this.curY = element.getBoundingClientRect().top;

    // set position:absolute (if not already done)
    this.renderer.setStyle(element, 'position', 'absolute');

    // compensate for the new position:absolute
    // and/or padding / margin / borders (if present)
    // by making a move of 0 pixels and then compute the offset:
    this.moveElement(element, this.curX, this.curY);
    const afterX = element.getBoundingClientRect().left;
    const afterY = element.getBoundingClientRect().top;
    this.offsetX = (this.curX - afterX);
    this.offsetY = (this.curY - afterY);
    if (this.offsetX != 0 || this.offsetY != 0) {
      this.moveElement(element, this.curX + this.offsetX, this.curY + this.offsetY);
    }
  }


  /* ======= TOUCH ======= */
  startTouch(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchStart = { x: touch.clientX - this.position.x, y: touch.clientY - this.position.y };
  }

  moveTouch(event: any) {
    event.preventDefault(); // evita el scroll
    const touch = event.touches[0];
    this.position.x = touch.clientX - this.touchStart.x;
    this.position.y = touch.clientY - this.touchStart.y;
  }

  endTouch(event: any) {
    const target = event.target as HTMLElement;
    let currentId = target.id;
    const element = document.getElementById(currentId) as HTMLElement;
    const rect = element.getBoundingClientRect();
    this.curX = rect.left;
    this.curY = rect.top;
    this.isInsideDropZone()
  }

  isInsideDropZone(){
    this.curX = this.curX-20
    this.curY = this.curY+12
    if(this.curX >= (this.dropsArea.a.x-15) && this.curX <= (this.dropsArea.a.x + (this.dropsArea.a.w/2)) && this.curY >= (this.dropsArea.a.y-100) && this.curY <= (this.dropsArea.a.y + this.dropsArea.a.h/2)) {
      this.dragDrop('boxA');
    }else if(this.curX >= (this.dropsArea.b.x-15) && this.curX <= (this.dropsArea.b.x + (this.dropsArea.b.w/2)) && this.curY >= (this.dropsArea.b.y-100) && this.curY <= (this.dropsArea.b.y + this.dropsArea.b.h/2)) {
      this.dragDrop('boxB');
    }
    this.position.x = 0;
    this.position.y = 0;
  }

  getCoorBoxes() {
    let containerDrops = document.querySelector('.container-drops') as HTMLDivElement;
    const parentRect = containerDrops.getBoundingClientRect();
    this.dropsArea = {
      a: { x: this.boxA.nativeElement.getBoundingClientRect().left - parentRect.left, y: this.boxA.nativeElement.getBoundingClientRect().top, h: this.boxA.nativeElement.offsetHeight, w: this.boxA.nativeElement.offsetWidth },
      b: { x: this.boxB.nativeElement.getBoundingClientRect().left - parentRect.left, y: this.boxB.nativeElement.getBoundingClientRect().top, h: this.boxB.nativeElement.offsetHeight, w: this.boxB.nativeElement.offsetWidth }
    }

  }
  /* ================================ TOUCH end =============================================== */

  // Método para barajar el array
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  play() {
    this.onAudioEnded()
    this.isRuning = true
    this.isCompletedAux = false
    this.isCompleted = false
    setTimeout(() => {
      this.getCoorBoxes();
    }, 1000);
  }

  reset() {
    this.autoplay = false
    this.itemsResources = this.shuffleArray(this.itemsResources);
    this.itemsResourcesPos = 0;
    const imgsEl = document.querySelectorAll('.boxDrop > img');
    imgsEl.forEach((imgEl) => {
      imgEl.remove();
    });
  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1
    this._gameService.navegationGame(direction, typeDirection)
    this.section += direction
  }

  handleClickBox(btn: number) {
    if (btn === 0) {
      this.handleClickNextAudio(this.itemsResources[this.itemsResourcesPos].audioL)
    } else {
      this.handleClickNextAudio(this.itemsResources[this.itemsResourcesPos].audioR)
    }
  }
  
  /* DROP */
  dragStart(ev: any) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("Text", ev.currentTarget.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.currentTarget, 50, 50);
    return true;
  }

  dragDrop(box: 'boxA' | 'boxB') {                  
    const boxCode = ['boxA', 'boxB']

    if (boxCode[this.itemsResources[this.itemsResourcesPos].boxExplosion] === box) {
      this.explosion = true

      this.handleSecondaryAudio('assets/audios/balloon-pop.mp3');
      setTimeout(() => {
        this.explosion = false
      }, 1000);

      // Avanzar a la siguiente imagen
      this.itemsResourcesPos++;

      if (this.itemsResourcesPos >= this.itemsResources.length) {
        this.isCompleted = true;

        this.handleClickNextAudio('assets/audios/gritos_ganaste.mp3');
        this.reset();
        setTimeout(() => {
          this.isCompletedAux = true;
          this.handleSecondaryAudio('assets/audios/sonido_ganaste.mp3');
          this._toastGameService.toast.set({
            type: 's', timeS: 3, title: "¡Ganaste!", message: "Nivel completado con éxito!", end: () => {
              this._toastGameService.toast.set(undefined);
            }
          });
        }, 500);

        setTimeout(() => {
          this.isCompleted = true;
          this.isRuning = false;

          // Avanzar a la siguiente imagen
          this.itemsResourcesPos++;
          if (this.itemsResourcesPos >= this.itemsResources.length) {
            this.itemsResourcesPos = 0; // Reiniciar a la primera imagen si se completan todas
          }
        }, 3300);
        this.itemsResourcesPos = -1; // Resetea el índice si se completan todas las imágenes
      } else {
        // Acción cuando el drop es exitoso
        this.handleClickNextAudio(['assets/audios/sonido_excelente.mp3', 'assets/audios/sonido_perfecto.mp3'][Math.floor(Math.random() * 2)]);
        this._toastService.toast.set({
          type: 's', timeS: 3, title: "¡Bien hecho!", message: "¡sigue jugando!", end: () => {
            this._toastService.toast.set(undefined);
          }
        });
        setTimeout(() => {
          this.onAudioEnded()
        }, 1100);
      }
    } else {
      this.handleClickNextAudio('assets/audios/error.mp3');
      setTimeout(() => {
        this.handleClickNextAudio('assets/audios/sonido_intentalo_nuevo.mp3');
      }, 400);
    }

    return false;
  }

  isCompletedAux = false
  currentIndex = -1
  audioMultiple = ''
  onAudioEnded() {
    this.currentIndex++;
    if (this.currentIndex == 0) {
      this.audioMultiple = this.itemsResources[this.itemsResourcesPos].audioL
      this.playAudioMultiple();
    } else if (this.currentIndex == 1) {
      this.audioMultiple = this.itemsResources[this.itemsResourcesPos].audioR
      this.playAudioMultiple();
    } else {
      this.currentIndex = -1
    }
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
  playAudioMultiple() {
    setTimeout(() => {
      (document.getElementById('audioMultiple') as HTMLAudioElement).play();
    }, 2);
  }
}
