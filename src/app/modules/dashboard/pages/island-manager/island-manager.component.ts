import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NftHeaderComponent } from '../nft/nft-header/nft-header.component';
import { NftAuctionsTableComponent } from '../nft/nft-auctions-table/nft-auctions-table.component';
import { Table } from 'src/app/core/models/interfaces-graphics';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SpeechTherapyService } from 'src/app/core/services/dashboard/speech-therapy.service';

interface User {
  id: number;
  name: string;
  enabled: boolean;
}

@Component({
  selector: 'app-island-manager',
  standalone: true,
  imports: [
    CommonModule,
    NftHeaderComponent, 
    NftAuctionsTableComponent],
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

  users: User[] = [
    { id: 1, name: 'Juan Pérez', enabled: false },
    { id: 2, name: 'Ana Gómez', enabled: true },
    { id: 3, name: 'Carlos Ramírez', enabled: false },
    { id: 4, name: 'María López', enabled: true }
  ];

  toggleLevel(user: User) {
    console.log(`Nivel ${user.enabled ? 'habilitado' : 'deshabilitado'} para ${user.name}`);
    // Aquí puedes hacer una petición HTTP para actualizar el estado en el backend
  }

  updateTable(data: any[]) {
    this.table   = [...data];
  }

  fetchData(graphic: string, callback: (res: any) => void) {
    this._speechTherapyService.dataGraphics({ graphic, valueToSearch: this.token }).subscribe({
      next: (res) => {
        if (!res.isError && res.res) callback(res.res);
      },
      error: (err) => console.error(`Error in graphic ${graphic}:`, err),
    });
  }

  getDataGraphic() {
    /* TABLA 1 */
    this.fetchData('g-5', (res: any[]) => {
      this.updateTable(res);
    });
  }
  onUserSelected(user: any): void {
    this.selectedUser = user;
    console.log('Usuario seleccionado speech:', this.selectedUser);
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit(): void {
    this.getDataGraphic();
  }

  // Funciones de manejo de datos y gráficos...

  constructor(private _authService: AuthService, private _speechTherapyService: SpeechTherapyService) {
    this.token = this._authService.getToken();
    if (!this.token) return;
  }
}
