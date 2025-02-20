import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Table } from '../../models/interfaces-graphics';

@Injectable({
  providedIn: 'root'
})
export class SpeechTherapyService {
  public selectedUser = signal<Table | null>(null);

  setSelectedUser(user: Table): void {
    this.selectedUser.set(user);
  }

  apiUrl = environment.baseApiBD;
  /* apimxHeader: HttpHeaders; */
  
  constructor(private _httpClient: HttpClient, private _authService: AuthService){
    /* this.apimxHeader = new HttpHeaders({
      'Ocp-Apim-Subscription-Key':
      environment.apimxKeys.xkeyx,
    }); */
  }
  
  dataGraphic(graphic: string): Observable<any> {
    const url = `${this.apiUrl}/${graphic}`;
    
    return this._httpClient.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataGraphics(graphic: {graphic: string, valueToSearch: any} ): Observable<any> {
    const url = `${this.apiUrl}/graphic`;
    return this._httpClient.post<any>(url, graphic)
      .pipe(
        catchError(this.handleError)
      );
    
  }

  validate(token: any): Observable<any> {
      return this._httpClient.post<any>(`${this.apiUrl}/validate`, { token: token},
      {
        /* headers: this.apimxHeader, */
      })
  }

  assignPatient( user_id_patient: number): Observable<any> {
    const body = {
      user_id_patient: user_id_patient,
      token: this._authService.getToken() // Asegúrate de pasar el token si es necesario
    };
  
    // Realiza una solicitud POST para insertar los datos en la tabla user_assignment
    return this._httpClient.post(`${this.apiUrl}/user_assignment/create`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  unassignPatient( user_id_patient: number): Observable<any> {
    const body = {
      user_id_patient: user_id_patient.toString(),
      token: this._authService.getToken() // Asegúrate de pasar el token si es necesario
    };
  
    // Realiza una solicitud POST para insertar los datos en la tabla user_assignment
    return this._httpClient.delete(`${this.apiUrl}/user_assignment/deleteById`, {body})
      .pipe(
        catchError(this.handleError)
      );
  }

  enableIsland( user_id_patient: number, island: number, level: number): Observable<any> {
    const body = {
      user_id_patient: user_id_patient,
      island: island,
      level: level,
      token: this._authService.getToken() // Asegúrate de pasar el token si es necesario
    };
  
    // Realiza una solicitud POST para habilitar la isla
    return this._httpClient.post(`${this.apiUrl}/user_enable_island/update`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  disableIsland( user_id_patient: number, island: number, level: number): Observable<any> {
    const body = {
      user_id_patient: user_id_patient.toString(),
      island: island,
      level: level,
      token: this._authService.getToken() // Asegúrate de pasar el token si es necesario
    };
  
    // Realiza una solicitud POST para deshabilitar la isla
    return this._httpClient.delete(`${this.apiUrl}/user_disable_island/update`, {body})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error en la petición:', error);
    return throwError(error);
  }
}
