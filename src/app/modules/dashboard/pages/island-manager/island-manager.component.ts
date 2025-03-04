import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NftHeaderComponent } from '../nft/nft-header/nft-header.component';
import { NftAuctionsTableComponent } from '../nft/nft-auctions-table/nft-auctions-table.component';
import { Table, User } from 'src/app/core/models/interfaces-graphics';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SpeechTherapyService } from 'src/app/core/services/dashboard/speech-therapy.service';

@Component({
  selector: 'app-island-manager',
  standalone: true,
  imports: [
    CommonModule,
    NftHeaderComponent, 
    NftAuctionsTableComponent,
  ],
  templateUrl: './island-manager.component.html',
  styleUrl: './island-manager.component.css'
})

export class IslandManagerComponent {
  private token;
  public selectedUser: any = null;
  table: Table[] = [];
  isTableVisible = true;
  // Opciones de filtros
  filterOptions = [
    { key: 'table', label: 'Tabla', active: true },
  ];

  toggleLevel(user: User) {
    console.log(`Nivel ${user.enabled ? 'habilitado' : 'deshabilitado'} para ${user.name}`);
    // Aquí puedes hacer una petición HTTP para actualizar el estado en el backend
  }

  updateTable(data: any[]) {
    this.table   = [...data];
    const userIds = this.table.map(user => user.user_id);
    
    // Iterar sobre cada user_id y llamar a fetchDataSumary
    userIds.forEach(userId => {
      this.fetchDataSumary(userId, (res: any[]) => {
        // Buscar el objeto correspondiente en this.table y actualizar su 'levels'
        const userIndex = this.table.findIndex(user => user.user_id === userId);
        if (userIndex !== -1) {
          this.table[userIndex] = { 
            ...this.table[userIndex], 
            levels: res
          };
        }
      });
    });
  }

  fetchDataTable(graphic: string, callback: (res: any) => void) {
    this._speechTherapyService.dataGraphics({ graphic, valueToSearch: this.token }).subscribe({
      next: (res) => {
        if (!res.isError && res.res) callback(res.res);
      },
      error: (err) => console.error(`Error in graphic ${graphic}:`, err),
    });
  }
  fetchDataSumary(id_user: number, callback: (res: any) => void){
    this._speechTherapyService
    .dataSumary({ id_user, valueToSearch: this.token })
    .subscribe({
      next: (res) => {
        callback(res);
      },
      error: (error) => console.error('Error al obtener datos:', error)
    });
  }

  getDataGraphic() {
    /* TABLA 1 */
    this.fetchDataTable('g-5', (res: any[]) => {
      this.updateTable(res);
    });
  }
  onUserSelected(user: any): void {
    this.selectedUser = user;
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit(): void {
    this.getDataGraphic();
  }
  constructor(private _authService: AuthService, private _speechTherapyService: SpeechTherapyService) {
    this.token = this._authService.getToken();
    if (!this.token) return;
  }
}
