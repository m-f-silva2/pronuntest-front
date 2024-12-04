import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, concatMap, Observable, of, tap } from 'rxjs';
import { IslandLevel, IslandLevelFull } from 'src/app/core/models/island_level';
import { LevelStructure } from 'src/app/core/models/levels_structure';
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
  _islandLevels = new BehaviorSubject<IslandLevelFull[] | undefined>(undefined)
  apiUrl = environment.baseApiBD + '/' + environment.apimUrlModules.games;
  currentGame = { posGame: 0, posLevel: 0, posIsland: 0, progress: 0, goal: 0, phoneme: '' }
  structures: LevelStructure[] = []
  structure?: LevelStructure

  dataGames: IDataGame = {
    islands: [
      {//Isla 0
        levels: [
          { games: [ { gameNum: 1,  sections: [{ type: 'info' }, { type: 'game' }, { type: 'game' }, { type: 'game' }] },]},
          { games: [ { gameNum: 2,  sections: [{ type: 'info' }, { type: 'game' }] },]},
          { games: [ { gameNum: 3, sections: [{ type: 'info' }, { type: 'game' }] },]},
          { games: [ { gameNum: 4,  sections: [{ type: 'info' }, { type: 'game' }] },]},
        ]
      },
      {//Isla 1
        levels: [
          {games: [{ gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] },]},
          {games: [{ gameNum: 2, sections: [{ type: 'info' }, { type: 'game' }] },]},
          {games: [{ gameNum: 3, sections: [{ type: 'info' }, { type: 'game' }] },]},
          {games: [{ gameNum: 4, sections: [{ type: 'info' }, { type: 'game' }] },]},
        ]
      },
      {//Isla 2
        levels: [
          { games: [ { gameNum: 1, sections: [{ type: 'info' }, { type: 'game' }] },]},
          { games: [ { gameNum: 2, sections: [{ type: 'info' }, { type: 'game' }] },]},
          { games: [ { gameNum: 3, sections: [{ type: 'info' }, { type: 'game' }] },]},
          { games: [ { gameNum: 4, sections: [{ type: 'info' }, { type: 'game' }] },]},
        ]
      },
      {//Isla 3
        levels: [
        ]
      },
    ]
  }

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
  set islandLevels$(IslandLevelFull: IslandLevelFull[] | undefined) {
    this._islandLevels.next(IslandLevelFull)
  }

  /* componetes games (sections), level-info; next (end, normal), previous (first, normal)   */
  navegationGame(direction: number, type: 'endNext' | 'firstPrevious' | 'previous' | 'next') {
    if (!this.structure) {
      this.router.navigateByUrl(`/games/island`)
    }

    // === Si es una sección de un nivel: avanzar en el nivel ===
    if (type === 'next' || type === 'previous') {
      this.currentGame.progress += direction
      return
    }

    // === Si es una sección de los extremos del nivel: avanzar a otro nivel ===
    const nextGameExist = this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel].games[this.currentGame.posGame + direction]

    //Existe juego siguiente en este nivel?
    if (nextGameExist) {
      this.currentGame.posGame += direction
      this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland}/level/${this.currentGame.posLevel + 1}/gamePos/${this.currentGame.posGame + 1}`)
      return
      //Existe nivel siguiente en esta isla?
    } else if (this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel + direction]) {
      //Aquí finaliza el nivel si es en dirección +1

      //TODO ======== ACTUALIZAR NIEVEL ACTUAL Y PASAR AL NIEVEL SIGUIENTE ======
      if (direction > 0) {
        const _currentGame = {...this.currentGame}
        let island = this._islandLevels.getValue()?.find(res => res.code_island == _currentGame.posIsland && res.code_pos_level == (_currentGame.posLevel+1))
        
        
        const currentStructure = this.structures.find(res =>
          res.code_pos_level == (_currentGame.posLevel+1) && res.code_island == _currentGame.posIsland
        )
        if (island) {
          island.score = currentStructure?.level_goal_score
          island.intents! += 1 //FIXME: revisar si es nulo?
          this.updateIslandLevel(island).subscribe()
        } else {
          //Si es el primer nivel de una isla, crearla porque no existe
          this.createIslandLevel({
            //:La estructura tiene la isla y el nivel 
            isl_lev_str_id: currentStructure?.isl_lev_str_id,
            intents: 0,
            status: 'active',
            score: 0,
            best_accuracy_ia: 0,
            worst_accuracy_ia: 0,
            date_created: new Date().toISOString().slice(0, 19).replace('T', ' '),
            sum_act_id: this._sumaryActivity.getValue()?.sum_act_id,
          }).subscribe(res=>{
            //TODO: Añadir nuevo island level al observable
            let islandNew = this._islandLevels.getValue()
            islandNew?.push({...res, ...currentStructure})
            this.islandLevels$ = islandNew
          })
        }
      }
      //...

      //(Buscar si existe el siguiente nivel) Validar si ya había completado el nivel en db, sino crear
      const nextSumaryActivityDB = this._sumaryActivities.getValue()?.find(res =>
        res.isl_lev_id === (this.currentGame.posIsland) && res.isl_lev_str_id?.toString() === ((this.currentGame.posLevel + direction) + direction)?.toString()
      )

      //Si no existe en db el nivel, crearlo
      if (nextSumaryActivityDB) {
        this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland}/level/${(this.currentGame.posLevel + direction) + direction}/gamePos/1`)
        this.currentGame.posLevel = this.currentGame.posLevel + direction
        this.currentGame.posGame = 0
        this.currentGame.progress = 0
        this._sumaryActivity.next(nextSumaryActivityDB)
      } else {

        //Buscar nivel en local o db, sino crearlo
        this.getLevelByUserPhoneLevelIsland(this.currentGame.phoneme, (this.currentGame.posLevel + direction + 1), this.currentGame.posIsland).subscribe(value => {
          if (value.isError) throw new Error(value.res.toString())
          const newStructure = this.structures.find(res =>
            res.code_pos_level == ((this.currentGame.posLevel + direction) + direction) && res.code_island == this.currentGame.posIsland
          )

          this.currentGame.posLevel = this.currentGame.posLevel + direction
          this.currentGame.posGame = 0
          this.currentGame.progress = 0

          if (!value.res) {
            this.createIslandLevel({
              //:La estructura tiene la isla y el nivel 
              isl_lev_str_id: newStructure?.isl_lev_str_id,
              intents: 0,
              status: 'active',
              score: 0, /* newStructure?.level_goal_score */
              best_accuracy_ia: 0,
              worst_accuracy_ia: 0,
              date_created: new Date().toISOString().slice(0, 19).replace('T', ' '),
              sum_act_id: this._sumaryActivity.getValue()?.sum_act_id,
            }).subscribe(res => {
              this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland}/level/${(this.currentGame.posLevel + direction)}/gamePos/1`)
              this.structure = newStructure
              this._islandLevels.next([res.res, ...this._islandLevels?.getValue() ?? []])
            })


          } else {
            this.structure = newStructure
            this.router.navigateByUrl(`/games/island/${this.currentGame.posIsland}/level/${(this.currentGame.posLevel + direction)}/gamePos/1`)
          }
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
  updateIslandLevel(islandLevel: IslandLevel): Observable<{ isError: boolean, res: any }> {
    return this._httpClient.put<any>(`${this.apiUrl}/island_levels/update`, islandLevel).pipe(
      tap((_sumaryActivitiesRes: { isError: boolean, res: any }) => {
        if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())
        //TODO
      })
    )
  }

  getLevelByUserPhoneLevelIsland(phoneme: string, codePosLevel: number, code_island: number): Observable<{ isError: boolean, res: IslandLevel }> {
    return this._httpClient.get<any>(
      `${this.apiUrl}/island_level_by_user_phoneme_island?phoneme=${phoneme}&code_pos_level=${codePosLevel}&code_island=${code_island}`).pipe(
        tap((_sumaryActivitiesRes: { isError: boolean, res: any }) => {
          if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())
          //TODO
        })
      )
  }
  getAllLevelByUserPhone(phoneme: string): Observable<{ isError: boolean, res: any }> {
    return this._httpClient.get<any>(
      `${this.apiUrl}/island_level_all_by_user_phoneme?phoneme=${phoneme}`).pipe(
        tap((_sumaryActivitiesRes: { isError: boolean, res: any }) => {
          if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())
          //TODO
        })
      )
  }

  getDataGame(island: number, level: number, gamePos: number): Observable<{ isError: boolean, res: unknown }> {

    const phoneme = localStorage.getItem('phoneme')
    if (!phoneme) {
      this.router.navigateByUrl(`/games`)
      throw new Error()
    }
    this.currentGame.phoneme = phoneme

    const structuresObservers = this.structures.length > 0 ? of({ res: this.structures }) : this._httpClient.get<any>(`${this.apiUrl}/island_level_structures_by_phoneme?phoneme=${phoneme}`)
    let aux_sum_act_id
    return structuresObservers.pipe(
      concatMap((structuresRes: { isError: boolean, res: LevelStructure[] }) => {
        this.structures = structuresRes.res


        this.structure = this.structures.find(res => res.code_island === island && res.code_pos_level === level && res.phoneme_type === phoneme)

        //Si no existe el resumen local traerlo de la nube
        if (!this._sumaryActivity.getValue()) {
          return this._httpClient.get<any>(`${this.apiUrl}/sumary_activity_by_user`)
        } else {
          return of({ isError: false, res: this._sumaryActivity.getValue() });
        }
      }),

      concatMap((_sumaryActivitiesRes: { isError: boolean, res: SumaryActivities }) => {
        if (_sumaryActivitiesRes.isError) throw new Error(_sumaryActivitiesRes.res.toString())

        if (!_sumaryActivitiesRes.res) {
          //Si el resumen no existe, crearlo // Si hay datos, retornarlos
          return this.createSummary({
            isl_lev_id: undefined,
            user_id: undefined,
            score_game: 0,
            date_created: new Date().toISOString().slice(0, 19).replace('T', ' '),
          })
        } else {
          return of(_sumaryActivitiesRes);
        }
      }),
      concatMap((_sumaryActivitiesRes2: { isError: boolean, res: SumaryActivities }) => {
        if (_sumaryActivitiesRes2.isError) throw new Error(_sumaryActivitiesRes2.res.toString())
        let _sumaryActivities = _sumaryActivitiesRes2.res
        this._sumaryActivity.next(_sumaryActivities ?? {})
        aux_sum_act_id = _sumaryActivitiesRes2.res.sum_act_id
        //Si el resumen no existe, crearlo
        if (!this._islandLevels.getValue()) {
          return this.getAllLevelByUserPhone(this.currentGame.phoneme)
        } else {
          return of({ isError: false, res: this._islandLevels.getValue() })
        }
      }),

      concatMap((resIslandLevel: { isError: boolean, res: IslandLevel[] }) => {
        if (resIslandLevel.isError) throw new Error(resIslandLevel.res.toString())
        //Si la isla no existe, crearla
        if (resIslandLevel.res.length === 0) {
          return this.createIslandLevel({
            isl_lev_str_id: this.structure?.isl_lev_str_id,
            intents: 0,
            status: 'active',
            score: 0,
            best_accuracy_ia: 0,
            worst_accuracy_ia: 0,
            date_created: new Date().toISOString().slice(0, 19).replace('T', ' '),
            sum_act_id: aux_sum_act_id!,
          })
        } else {
          return of({ isError: false, res: resIslandLevel.res })
        }
      }),


      concatMap((resIslandLevel: { isError: boolean, res: IslandLevel[]|IslandLevel }) => {
        if (resIslandLevel.isError) throw new Error(resIslandLevel.res.toString())

        //Niveles jugados
        const islandLevels = Array.isArray(resIslandLevel.res)
        ? resIslandLevel.res
        : [{...this.structure, ...resIslandLevel.res}].flat();
        this._islandLevels.next(islandLevels)


        //Posición actual
        this.currentGame.posIsland = island
        this.currentGame.posGame = (gamePos - 1)
        this.currentGame.posLevel = (level - 1)

        //Posición actual
        let countSections = 0
        this.currentGame.progress = 0

        //FIXME: progreso mal calculado
        this.dataGames.islands[this.currentGame.posIsland].levels[this.currentGame.posLevel].games.forEach((game, indexGame) => {
          countSections += game.sections.length
          if (indexGame < gamePos) {
            this.currentGame.progress++
          }
        })
        this.currentGame.goal = countSections

        return of(resIslandLevel)
      })
    )
  }


  sendAudio(audio: ArrayBuffer, phoneme: string): Observable<any> {
    const boundary = "boundary";
    const headers = new HttpHeaders({
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "accept": `*/*`
    });

    const blob = new Blob([audio], { type: 'audio/wav' });
    return this._httpClient.post<any>(`https://pronuntest-back.onrender.com/api/word/${phoneme}`, blob, { headers: headers }).pipe(
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
