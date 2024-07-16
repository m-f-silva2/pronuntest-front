import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { LevelStructure } from 'src/app/core/models/levels_structure';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  _levelStructure = new BehaviorSubject<LevelStructure|undefined>(undefined)
  apiUrl = environment.baseApiBD + '/' + environment.apimUrlModules.games;
  dataGames = {
    islands: [
      { levels: [{games: [0]},{games: [1]},{games: [2]},{games: [3]},{games: [4]}] },
      { levels: [{games: [0]},{games: [1]},{games: [2]},{games: [3]},{games: [4]}] },
      { levels: [{games: [0]},{games: [1]},{games: [2]},{games: [3]},{games: [4]}] },
    ]
  }
  /* apimxHeader: HttpHeaders; */
  
  constructor(private _httpClient: HttpClient){
    /* this.apimxHeader = new HttpHeaders({
      'Ocp-Apim-Subscription-Key':
      environment.apimxKeys.xkeyx,
    }); */
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
