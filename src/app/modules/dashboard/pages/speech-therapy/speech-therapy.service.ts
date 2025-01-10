import { HttpClient } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Table } from 'src/app/core/models/interfaces-graphics';

@Injectable({
  providedIn: 'root'
})
export class SpeechTherapyService {
  public test = signal<{test: string }>({ test: '' });
  private url = 'https://mocki.io/v1/3215d723-df54-4d02-bb4c-f34b86db9165';

  constructor(private httpClient: HttpClient) {}

  public async getTest(): Promise<any> {
    return await lastValueFrom(this.httpClient.get<any>(this.url));
  }
  public selectedUser = signal<Table | null>(null);

  setSelectedUser(user: Table): void {
    this.selectedUser.set(user);
  }

}