import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, takeUntil, tap } from 'rxjs';
import { IslandLevel } from 'src/app/core/models/island_level';
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
  currentGame = { posGame: 0, posLevel: 0, posIsland: 0, progress: 0, goal: 0 }

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
              //{ gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego escuchar
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
              //{ gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] }, //información, juego escuchar
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

  get sumaryActivities$() {
    return this._sumaryActivities.asObservable()
  }
  get sumaryActivity$() {
    return this._sumaryActivity.asObservable()
  }
  set sumaryActivities(activities: SumaryActivities[] | undefined) {
    this._sumaryActivities.next(activities)
  }

  /* componetes games (sections), level-info; next (end, normal), previous (first, normal)   */
  navegationGame(direction: number, type: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    // === Si es una sección de un juego ===
    if (type === 'next' || type === 'previous') {
      this.currentGame.progress += direction
      return
    }

    // === Si es una sección de los extremos de juego ===
    const nextGameExist = this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel].games[this.currentGame.posGame + direction]

    //Existe juego siguiente en este nivel?
    if (nextGameExist) {
      this.currentGame.posGame += direction
      this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland + 1}/level/${this.currentGame.posLevel + 1}/gamePos/${this.currentGame.posGame + 1}`)
      return
      //Existe nivel siguiente en esta isla?
    } else if (this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel + direction]) {
      //Aquí finaliza el nivel si es en dirección +1
      //(Buscar si existe el siguiente nivel) Validar si ya había completado el nivel en db, sino crear
      const nextSumaryActivityDB = this._sumaryActivities.getValue()?.find(res =>
        res.isl_id === (this.currentGame.posIsland + 1) && res.isl_lev_str_id?.toString() === ((this.currentGame.posLevel + direction) + direction)?.toString()
      )

      //Si no existe en db el nivel, crearlo
      if (nextSumaryActivityDB) {
        this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland + 1}/level/${(this.currentGame.posLevel + direction) + direction}/gamePos/1`)
        this.currentGame.posLevel = this.currentGame.posLevel + direction
        this.currentGame.posGame = 0
        this.currentGame.progress = 0
        this._sumaryActivity.next(nextSumaryActivityDB)
      } else {
        //Primero crear la isla nivel
        this.createIslandLevel({
          isl_id: this.currentGame.posIsland + 1,
          isl_lev_str_id: ((this.currentGame.posLevel + direction) + direction).toString(),
          isl_lev_max_intents: 0,
          isl_lev_status: '',
        }).subscribe(resIslandLevel => {
          //Luego crear el resumen
          console.info('>> 2 resIslandLevel siguiente creado:', resIslandLevel)
          this.createSummary({
            isl_lev_id: resIslandLevel.res.isl_lev_id,
            users_id: 1, //FIXME : temporal users_id
            sum_act_score_game: 0,
            sum_act_intents: 0,
            sum_act_best_accuracy_ia: 0,
            sum_act_worst_accuracy_ia: 0,
            sum_act_date_created: new Date().toISOString()
          }).subscribe(resSumary => {
            console.info('>> 2 summary siguiente creado:', resSumary)

            this.currentGame.posLevel = this.currentGame.posLevel + direction
            this.currentGame.posGame = 0
            this.currentGame.progress = 0

            const auxSumaryActivities = this._sumaryActivities.getValue()
            const auxSumaryActivity = {
              isl_id: this.currentGame.posIsland + 1,
              isl_lev_str_id: ((this.currentGame.posLevel + direction) + direction).toString(),
              isl_lev_max_intents: 0,
              isl_lev_status: '',
              //
              isl_lev_id: resIslandLevel.res.isl_lev_id,
              users_id: 1, //FIXME : temporal users_id
              sum_act_score_game: 0,
              sum_act_intents: 0,
              sum_act_best_accuracy_ia: 0,
              sum_act_worst_accuracy_ia: 0,
              sum_act_date_created: new Date().toISOString()
            }
            this._sumaryActivity.next(auxSumaryActivity)
            auxSumaryActivities?.push(auxSumaryActivity)
            this._sumaryActivities.next(auxSumaryActivities)
            this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland + 1}/level/${(this.currentGame.posLevel + direction)}/gamePos/1`)
          })
        })
      }
      return
    }
    //== Si el ultimo juego y nivel: ir a las islas
    this.router.navigateByUrl(`/games/island`) //TODO: ${this.levelStructure!.isl_id!}

  }

  createSummary(sumaryActivities: SumaryActivities): Observable<{ isError: boolean, res: any }> {
    return this._httpClient.post<any>(`${this.apiUrl}/sumary_activities/create`, sumaryActivities).pipe(
      tap((_sumaryActivitiesRes: { isError: boolean, res: any }) => {
        if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())
        //TODO
      })
    )
  }
  createIslandLevel(islandLevel: IslandLevel): Observable<{ isError: boolean, res: any }> {
    return this._httpClient.post<any>(`${this.apiUrl}/island_levels/create`, islandLevel).pipe(
      tap((_sumaryActivitiesRes: { isError: boolean, res: any }) => {
        if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())
        //TODO
      })
    )
  }

  getDataGame(island: number, level: number, gamePos: number): Observable<{ isError: boolean, res: SumaryActivities[] }> {
    return this._httpClient.get<any>(`${this.apiUrl}/sumary_activities_by_user`).pipe(
      tap((_sumaryActivitiesRes: { isError: boolean, res: SumaryActivities[] }) => {

        if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())
        this.currentGame.posGame = (gamePos - 1)
        this.currentGame.posIsland = (island - 1)
        this.currentGame.posLevel = (level - 1)
        let _sumaryActivities = _sumaryActivitiesRes.res

        //Si no tiene datos inicializar array por defecto en el primer nivel
        if (_sumaryActivitiesRes.res.length === 0) {
          _sumaryActivities = [{
            sum_act_id: 1,
            isl_lev_id: 1,
            users_id: 1,
            sum_act_score_game: 0,
            sum_act_intents: 0,
            sum_act_best_accuracy_ia: 0,
            sum_act_worst_accuracy_ia: 0,
            sum_act_date_created: "2024-06-10T17:15:00.000Z",
            //
            isl_id: 1,
            isl_lev_str_id: '1',
            isl_lev_max_intents: 3,
            isl_lev_status: "start",
          }]

          //Primero crear la isla nivel
          this.createIslandLevel({
            isl_id: _sumaryActivities[0].isl_id,
            isl_lev_str_id: _sumaryActivities[0].isl_lev_str_id,
            isl_lev_max_intents: _sumaryActivities[0].isl_lev_max_intents,
            isl_lev_status: _sumaryActivities[0].isl_lev_status,
          }).subscribe(resIslandLevel => {
            //Luego crear el resumen
            console.info('>> 2 islalevel current creado:', resIslandLevel)
            this.createSummary({
              isl_lev_id: resIslandLevel.res.isl_lev_id,
              users_id: 1, //FIXME : temporal users_id
              sum_act_score_game: 0,
              sum_act_intents: 0,
              sum_act_best_accuracy_ia: 0,
              sum_act_worst_accuracy_ia: 0,
              sum_act_date_created: new Date().toISOString()
            }).subscribe(resSumary => {
              console.info('>> 2 summary current creado:', resSumary)
            })
          })

        }

        let countSections = 0
        this.currentGame.progress = 0
        this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel].games.forEach((game, indexGame) => {
          countSections += game.sections.length

          if (indexGame < gamePos) {
            this.currentGame.progress++
          }
        })
        this.currentGame.goal = countSections

        this._sumaryActivity.next(_sumaryActivities[0] ?? {})
        this._sumaryActivities.next(_sumaryActivities)

      }),
    )
  }


  sendAudio(audio: ArrayBuffer): Observable<any> {
    const boundary = "boundary";
    const headers = new HttpHeaders({
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "accept": `*/*`
    });

    const blob = new Blob([audio], { type: 'audio/wav' });
    return this._httpClient.post<any>(`https://pronuntest-back.onrender.com/api/word/a`, blob, { headers: headers }).pipe(
      tap((res: unknown) => {
        //TODO: respuesta
        console.info('>> >>  audio res 2:', res);
      }
      ))
  }

  arrayBufferToWav(arrayBuffer: ArrayBuffer): ArrayBuffer {
    const view = new DataView(arrayBuffer);
    const numOfChan = 1; // Número de canales, ajusta según sea necesario
    const sampleRate = 44100; // Frecuencia de muestreo, ajusta según sea necesario
    const length = arrayBuffer.byteLength + 44;
    const bufferArray = new ArrayBuffer(length);
    const wavView = new DataView(bufferArray);

    let offset = 0;

    function setUint16(data: number) {
      wavView.setUint16(offset, data, true);
      offset += 2;
    }

    function setUint32(data: number) {
      wavView.setUint32(offset, data, true);
      offset += 4;
    }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - offset - 4); // chunk length

    for (let i = 0; i < arrayBuffer.byteLength; i++) {
      wavView.setInt8(offset, view.getInt8(i));
      offset++;
    }

    return bufferArray
  }


}
