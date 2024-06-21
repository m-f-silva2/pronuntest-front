import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpeechTherapyService {

  apiUrl = environment.baseApiBD + '/api';
  /* apimxHeader: HttpHeaders; */
  
  constructor(private _httpClient: HttpClient){
    /* this.apimxHeader = new HttpHeaders({
      'Ocp-Apim-Subscription-Key':
      environment.apimxKeys.xkeyx,
    }); */
  }
  
  dataGraphic(graphic: string): Observable<any> {
    const url = `${this.apiUrl}/${graphic}`;
    console.log(url);
    return this._httpClient.get<any>(url)
      .pipe(
        catchError(this.handleError) // Manejo de errores opcional
      );
  }


  validate(token: any): Observable<any> {
      return this._httpClient.post<any>(`${this.apiUrl}/validate`, { token: token},
      {
        /* headers: this.apimxHeader, */
      })
  }

  private handleError(error: any) {
    console.error('Error en la petición:', error);
    return throwError(error); // Propaga el error
  }
}
