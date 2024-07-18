import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { environment } from 'src/environments/environment';

export interface IDataGame {
  islands: {
    levels: {
      games: {
        gameNum: number;
        sections: { type: 'info' | 'game' | 'skipe'; }[]
      }[];
    }[];
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  _levelStructure = new BehaviorSubject<LevelStructure | undefined>(undefined)
  apiUrl = environment.baseApiBD + '/' + environment.apimUrlModules.games;
  currentGame = { posGame: 0, posLevel: 0, posIsland: 0, progress: 0 }

  dataGames: IDataGame = {
    islands: [
      {
        levels: [
          {
            games: [
              { gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego escuchar
              { gameNum: 2, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego grabar
            ]
          },
          {
            games: [
              { gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego escuchar
              { gameNum: 3, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego barco
            ]
          },
          {
            games: [
              { gameNum: 4, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego cuadro-secuencia
            ]
          },
          {
            games: [
              { gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego escuchar
              { gameNum: 5, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego inflar-globo
            ]
          },
          {
            games: [
              { gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego escuchar
              { gameNum: 2, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego grabar
              { gameNum: 6, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego cajas
            ]
          },
        ]
      },
      {
        levels: [
        ]
      },
      {
        levels: [
        ]
      },
    ]
  }
  /* apimxHeader: HttpHeaders; */

  constructor(private _httpClient: HttpClient, private router: Router) {
    /* this.apimxHeader = new HttpHeaders({
      'Ocp-Apim-Subscription-Key':
      environment.apimxKeys.xkeyx,
    }); */
  }


  /* componetes games (sections), level-info; next (end, normal), previous (first, normal)   */
  navegationGame(direction: number, type: 'endNext'|'firstPrevious'|'previous'|'next') {
    
    if(type === 'next' || type === 'previous'){
      this.currentGame.progress = this.currentGame.progress + direction
      return
    }

    const nextGameExist = this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel].games[this.currentGame.posGame + direction]
    //Existe juego siguiente en este nivel?
    
    if (nextGameExist) {
      this.currentGame.posGame = this.currentGame.posGame + direction
      this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland+1}/level/${this.currentGame.posLevel+1}/game/${nextGameExist.gameNum}`)
      return
    //Existe nivel siguiente en esta isla?
    } else if ( this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel+direction]  ) {
      this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland+1}/level/${(this.currentGame.posLevel+1) + direction}/game/1`)
      this.currentGame.posLevel = this.currentGame.posLevel + direction
      this.currentGame.posGame = 0
      this.currentGame.progress = 0
      return
    }
    //Sino ir a las islas
    this.router.navigateByUrl(`/games/island`) //TODO: ${this.levelStructure!.isl_id!}

  }

  get levelStructure$() {
    return this._levelStructure.asObservable()
  }

  getDataGame(island: number, level: string): Observable<LevelStructure> {
    const data = {
      isl_lev_str_id: level,
      isl_id: island,
      typ_act_id: '',
      isl_lev_str_difficulty: '',
      isl_lev_str_requirement: '',
      isl_lev_str_description: '',
    }
    this.currentGame.posGame = 0
    this.currentGame.posIsland = (data.isl_id-1)
    this.currentGame.posLevel = Number(level)-1
    this._levelStructure.next(data)
    return of(data)
    //return this._httpClient.get<any>(`${this.apiUrl}/game`,
    //{
    //  /* headers: this.apimxHeader, */
    //}).pipe(
    //  tap(res =>{
    //  }),
    //)
  }

}
