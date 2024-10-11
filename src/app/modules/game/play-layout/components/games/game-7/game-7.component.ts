import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
import { LevelInfoComponent } from '../../level-info/level-info.component';
import { IDataGame, GameService } from '../../../game.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { CommonModule } from '@angular/common';

interface Bomb {
  id: number;
  left: number;  // Posición horizontal de la bomba
  top: number;   // Posición vertical
  type: 'bomb' | 'noBomb' | 'removed'; // Tipo de imagen
  image?: string; // Imagen, si es un no bomba
}

@Component({
  selector: 'app-game-7',
  standalone: true,
  imports: [LevelInfoComponent, CommonModule],
  templateUrl: './game-7.component.html',
  styleUrls: ['./game-7.component.css'
  ]
})
export class Game7Component {
  sumaryActivity: SumaryActivities | undefined;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  sections: any[] = [];
  section = 0;
  countRecording = 0;
  dataGames: IDataGame;
  isCompleted = false;
  @ViewChild('containerIMG') containerIMG!: ElementRef<HTMLDivElement>;
  audios = ['assets/audios/fonema_d.wav', 'assets/audios/fonema_p.wav', 'assets/audios/fonema_s.wav', 'assets/audios/fonema_ch.wav', 'assets/audios/fonema_m.wav'];
  sounds = [false, false, false, false, false];
  points: number = 0;
  attempts: number = 5;
  gameInterval: any;
  bombs: Bomb[] = [];
  resultMessage: string = '';
  resultColor: string = 'black';
  nextBombId: number = 0; // Para identificar las bombas
  blockBtn: boolean = false; // Deshabilitar el botón de iniciar
  shouldClick: boolean = false; // Indica si se debe hacer clic después de escuchar el sonido
  isPlaying: boolean = true;

  // Definir la imagen de la bomba y las imágenes no bomba
  private bombImage = 'assets/images/isla0/balloon.svg';
  private otherImages = [
    'assets/images/isla0/snake.svg'
  ];
  // Crear instancias de Audio
  private bombSound = new Audio('assets/audios/fonema_p.wav');
  private noBombSound = new Audio('assets/audios/fonema_s.wav');

  constructor(public _gameService: GameService, private ref: ChangeDetectorRef, private router: Router, private renderer: Renderer2, private _toastService: ToastService) {
    this.dataGames = this._gameService.dataGames;
    this.sections.push({
      title: 'VAMOS A ESCUCHAR SONIDOS DE "' + this._gameService.currentGame.phoneme + '"',
      subtitle: undefined,
      resource: '',
      next: '1',
      previous: undefined
    });

    this._gameService.sumaryActivity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.sumaryActivity = res;
    });
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
  }

  btnsNavegation(typeDirection: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    const direction = (typeDirection === 'endNext' || typeDirection === 'next') ? 1 : -1;
    this._gameService.navegationGame(direction, typeDirection);
    this.section += direction;
  }

  ngOnInit() {}

  animation() {
    if (this.blockBtn) return;
    this.startGame();
  }

  startGame() {
    this.points = 0;
    this.attempts = 5;
    this.resultMessage = '';
    this.bombs = []; // Limpiamos las bombas al reiniciar el juego
    this.blockBtn = true; // Bloqueamos el botón

    // Aumentar la dificultad después de cada punto ganado
    let increaseDifficulty = setInterval(() => {
      if (this.attempts < 1) {
        clearInterval(increaseDifficulty);
        this.endGame();
        return;
      }

      this.addBomb(); // Añadir bombas/no bombas

      // Aumentar la dificultad cada 3 puntos
      if (this.points % 3 === 0 && this.points !== 0) {
        clearInterval(increaseDifficulty);
        this.gameInterval = setInterval(() => {
          this.addBomb();
        }, 1500); // Aumentar la velocidad de caída
      }
    }, 2000);
  }

  addBomb() {
    const left = Math.random() * 550; // Posición horizontal aleatoria
    const isBomb = Math.random() < 0.5; // 40% de probabilidad de ser una bomba

    const bomb: Bomb = {
      id: this.nextBombId++,
      left: left,
      top: Math.random() * 400, // Ajusta según el tamaño de tu div
      type: isBomb ? 'bomb' : 'noBomb',
      image: isBomb ? this.bombImage : this.otherImages[Math.floor(Math.random() * this.otherImages.length)],
    };

    this.bombs.push(bomb);

    // Reproducir el sonido de la bomba si es una bomba
    if (isBomb) {
      this.bombSound.play(); // Reproduce el sonido de la bomba
      this.shouldClick = true; // Se requiere un clic

      // Restar intentos si no se hace clic antes de que desaparezca
      setTimeout(() => {
        if (this.shouldClick) {
          this.attempts--; // Restar intento
          this.resultMessage = '¡Oh no! No hiciste clic a tiempo.';
          this.resultColor = 'red';
        }
      }, 2000); // Tiempo para hacer clic antes de que desaparezca
    }

    // Hacer que la bomba desaparezca después de 4 segundos
    setTimeout(() => {
      this.removeBomb(bomb.id);
    }, 4000);
  }

  moveBomb(bomb: Bomb) {
    const moveInterval = setInterval(() => {
      if (this.attempts < 1) {
        clearInterval(moveInterval);
        return;
      }

      bomb.top += 2; // Mover hacia abajo más lentamente

      // Verificar si la bomba ha salido del marco
      if (bomb.top > 300) { // Suponiendo que el contenedor tiene una altura de 300px
        this.removeBomb(bomb.id);
        this.attempts--; // Restar intento si la bomba sale del marco
        clearInterval(moveInterval); // Detener el movimiento
      }
    }, 100); // Ajustar la velocidad del movimiento
  }

  bombClicked(bombId: number) {
    const bomb = this.bombs.find(b => b.id === bombId);
    
    if (bomb) {
      this.shouldClick = false; // Resetear la necesidad de hacer clic

      if (bomb.type === 'bomb') {
        this.points++;
        this.resultMessage = '¡Bien hecho! Bomba correcta pinchada.';
        this.resultColor = 'green';

        // Verificar si ha ganado
        if (this.points >= 5) {
          this.isCompleted = true;
          this._toastService.toast.set({
            type: 's',
            timeS: 3,
            title: "¡Ganaste!",
            message: "Nivel completado con éxito!",
            end: () => { 
              this._toastService.toast.set(undefined);
            }
          });
          this.endGame();
        }
      } else {
        this.attempts--; // Restar intento si se hace clic en una imagen que no es bomba
        this.resultMessage = '¡Oh no! Imagen incorrecta pinchada.';
        this.resultColor = 'red'; // Color para imagen incorrecta

        // Verificar si se han agotado los intentos
        if (this.attempts < 1) {
          this.endGame();
        }
      }

      // Remover la bomba cuando se haga clic
      this.removeBomb(bombId);
    }
  }

  removeBomb(bombId: number) {
    this.bombs = this.bombs.filter(bomb => bomb.id !== bombId);
  }

  // Nueva función para eliminar bombas que no son bombas
  removeNoBombs() {
    this.bombs = this.bombs.filter(bomb => bomb.type === 'bomb'); // Solo conservar bombas
  }

  endGame() {
    clearInterval(this.gameInterval);
    this.resultMessage = `Juego terminado. Puntuación final: ${this.points}`;
    this.resultColor = 'blue';
    this.bombs = []; // Limpiar las bombas al terminar el juego
    this.blockBtn = false; // Desbloquear el botón para reiniciar el juego
  }

  
}
