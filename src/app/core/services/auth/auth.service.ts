import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.baseApiBD + '/' + environment.apimUrlModules.auth;
  /* apimxHeader: HttpHeaders; */
  
  constructor(private _httpClient: HttpClient){
    /* this.apimxHeader = new HttpHeaders({
      'Ocp-Apim-Subscription-Key':
      environment.apimxKeys.xkeyx,
    }); */
  }

  setRole(role: string) {
      localStorage.setItem('role', role )
  }
  getRole(): Observable<any> {
    return of(localStorage.getItem('role') ?? undefined)
  }

  setToken(token: string){
    localStorage.setItem('token', token )
  }  

  getToken(): string | undefined {
    return localStorage.getItem('token') ?? undefined
  }

  setEmail(email: string) {
    localStorage.setItem('email', email )
  }
  getEmail(): Observable<any> {
    return of(localStorage.getItem('email') ?? undefined)
  }
  setIdentification(identification: string) {
    localStorage.setItem('identification', identification )
  }
  getIdentification(): Observable<any> {
    return of(localStorage.getItem('identification') ?? undefined)
  }

  
  login(login: any): Observable<any> {
      return this._httpClient.post<any>(`${this.apiUrl}/login`, login,
      {
        /* headers: this.apimxHeader, */
      });
  }
  signup(data: any): Observable<any> {
      return this._httpClient.post<any>(`${this.apiUrl}/signup`, data,
      {
        /* headers: this.apimxHeader, */
      });
  }

  validateAndRole(token: any): Observable<any> {
      return this._httpClient.post<any>(`${this.apiUrl}/validate`, { token: token},
      {
        /* headers: this.apimxHeader, */
      }).pipe(
        tap(res =>{
          if(!res){
            localStorage.clear()
          }
        }),

      )
  }

  getCities(): Observable<any> {
    return this._httpClient.get<any>(`${environment.baseApiBD}/cities`,
    {
      /* headers: this.apimxHeader, */
    });
  }

}
