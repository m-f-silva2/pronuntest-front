import { Component, Input, OnInit } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Nft } from '../models/nft';
import { Table } from 'src/app/core/models/interfaces-graphics';
import { SpeechTherapyService } from 'src/app/core/services/dashboard/speech-therapy.service';

@Component({
    selector: '[nft-auctions-table-item]',
    templateUrl: './nft-auctions-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule, CommonModule],
    styleUrl: './nft-auctions-table-item.component.css'
})
export class NftAuctionsTableItemComponent implements OnInit {
  @Input() table = <Table>{};
  @Input() isAssignUser = <Boolean> false;
  @Input() isUnAssignUser = <Boolean> false;
  @Input() isIslandManager = <Boolean> false;

  constructor(private _speechTherapyService: SpeechTherapyService) {
  }

  ngOnInit(): void {
  }

  getImage(): string {
    return this.table.image === undefined ? 'assets/icons/heroicons/outline/users.svg' : (this.table.image === null ? 'assets/icons/heroicons/outline/users.svg' : this.table.image);
  }
  getGenderText(): string {
    return this.table.gender === 'm' ? 'Masculino' : (this.table.gender === 'f' ? 'Femenino' : '');
  }
  // Método para asignar paciente
  assignPatient(user_id_patient: number): void {
    // Llamar al servicio para insertar los datos en la tabla user_assignment
    this._speechTherapyService.assignPatient(user_id_patient).subscribe(
      response => {
        //console.log('Paciente asignado correctamente:', response);
        alert('Paciente asignado correctamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        console.error('Error al asignar paciente:', error);
        alert('Error al asignar paciente');
      }
    );
  }
  // Método para desasignar paciente
  unassignPatient(user_id_patient: number): void {
    // Llamar al servicio para insertar los datos en la tabla user_unassignment
    this._speechTherapyService.unassignPatient(user_id_patient).subscribe(
      response => {
        console.log('Paciente desasignado correctamente:', response);
        alert('Paciente desasignado correctamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        console.error('Error al desasignar paciente:', error);
        alert('Error al desasignar paciente');
      }
    );
  }
  // Método para habilitar nivel
  updateLevelStatus(isl_lev_id: number, code_pos_level: number, manual_status: string): void {
    // Llamar al servicio para insertar los datos en la tabla user_assignment
    this._speechTherapyService.updateLevelManualStatus(isl_lev_id, manual_status).subscribe(
      response => {
        const mensaje = manual_status == 'active' ? 'habilitada' : 'deshabilitada';
        alert('Nivel '+code_pos_level+' '+mensaje+' correctamente');
        /*setTimeout(() => {
          window.location.reload();
        }, 1000);*/
      },
      error => {
        console.error('Error al habilitar Nivel: '+code_pos_level, error);
        alert('Error al habilitar Nivel '+code_pos_level);
      }
    );
  }
  toggleStatus(code_pos_level: number, level: any) {
    // Cambiar el estado de 'manual_status' entre 'active' e 'inactive'
    level.manual_status = level.manual_status === 'active' ? 'inactive' : 'active';
    
    // Aquí puedes hacer una llamada HTTP para actualizar en la BD
    this.updateLevelStatus(level.isl_lev_id, code_pos_level, level.manual_status);
  }
  
  // Método para obtener los niveles de la isla específica (ej: Isla 4)
  getLevels(userId: number, codeIsland: number) {
    if (this.table.user_id === userId && Array.isArray(this.table.levels)) {
      return this.table.levels.filter(level => level.code_island === codeIsland);
    }
    return [];
  }
  
}
