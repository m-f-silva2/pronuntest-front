import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SumaryActivities } from 'src/app/core/models/sumary_activities';
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
export class GameService {
  _sumaryActivities = new BehaviorSubject<SumaryActivities[] | undefined>(undefined)
  _sumaryActivity = new BehaviorSubject<SumaryActivities | undefined>(undefined)
  apiUrl = environment.baseApiBD + '/' + environment.apimUrlModules.games;
  currentGame = { posGame: 0, posLevel: 0, posIsland: 0, progress: 0, goal: 0}

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
    
    // === Si es una sección de un juego ===
    if(type === 'next' || type === 'previous'){
      this.currentGame.progress += direction
      return
    }
    
    // === Si es una sección de los extremos de juego ===
    const nextGameExist = this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel].games[this.currentGame.posGame + direction]
    
    //Existe juego siguiente en este nivel?
    if (nextGameExist) {
      this.currentGame.posGame += direction
      this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland+1}/level/${this.currentGame.posLevel+1}/gamePos/${this.currentGame.posGame+1}`)
      return
    //Existe nivel siguiente en esta isla?
    } else if ( this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel+direction]  ) {
      this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland+1}/level/${(this.currentGame.posLevel+direction) + direction}/gamePos/1`)
      this.currentGame.posLevel = this.currentGame.posLevel + direction
      this.currentGame.posGame = 0
      this.currentGame.progress = 0
      return
    }
    //== Si el ultimo juego y nivel: ir a las islas
    this.router.navigateByUrl(`/games/island`) //TODO: ${this.levelStructure!.isl_id!}

  }

  get sumaryActivities$() {
    return this._sumaryActivities.asObservable()
  }
  get sumaryActivity$() {
    return this._sumaryActivity.asObservable()
  }

  getDataGame(island: number, level: string, gamePos: number): Observable<SumaryActivities[]> {

    return this._httpClient.get<any>(`${this.apiUrl}/sumary_activities_by_user`,
      {
        /* headers: this.apimxHeader, */
      }).pipe(
        tap((_sumaryActivities: SumaryActivities[]) =>{
          this.currentGame.posGame = gamePos||1
          this.currentGame.posIsland = (_sumaryActivities[0].isl_id! -1) //TODO: _sumaryActivities[0]
          this.currentGame.posLevel = Number(level)-1
          
          let countSections = 0
          this.currentGame.progress = 0
          this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posIsland].games.forEach((game, indexGame) => {
            countSections += game.sections.length
            
            if(indexGame < gamePos){
              this.currentGame.progress++
            }
          })
          this.currentGame.goal = countSections 
          
          console.log('>> >>  getDataGame res:', _sumaryActivities);
          this._sumaryActivity.next(_sumaryActivities[0])
          this._sumaryActivities.next(_sumaryActivities)
      }),
    )
  }

}
