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
  @Input() auction = <Table>{};
  @Input() isAssignUser = <Boolean> false;
  @Input() isUnAssignUser = <Boolean> false;
  @Input() isIslandManager = <Boolean> false;

  constructor(private _speechTherapyService: SpeechTherapyService) {
  }

  ngOnInit(): void {
  }

  getImage(): string {
    return this.auction.image === undefined ? 'assets/icons/heroicons/outline/users.svg' : (this.auction.image === null ? 'assets/icons/heroicons/outline/users.svg' : this.auction.image);
  }
  getGenderText(): string {
    return this.auction.gender === 'm' ? 'Masculino' : (this.auction.gender === 'f' ? 'Femenino' : '');
  }
  // Método para asignar paciente
  assignPatient(user_id_patient: number): void {
    // Llamar al servicio para insertar los datos en la tabla user_assignment
    this._speechTherapyService.assignPatient(user_id_patient).subscribe(
      response => {
        console.log('Paciente asignado correctamente:', response);
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
  // Método para habilitar isla
  enableIsland(user_id_patient: number, island: number, level: number): void {
    // Llamar al servicio para insertar los datos en la tabla user_assignment
    this._speechTherapyService.enableIsland(user_id_patient, island, level).subscribe(
      response => {
        console.log('Isla habilitada correctamente:', response);
        alert('Isla habilitada correctamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        console.error('Error al habilitar isla:', error);
        alert('Error al habilitar isla');
      }
    );
  }
  // Método para deshabilitar isla
  disableIsland(user_id_patient: number, island: number, level: number): void {
    // Llamar al servicio para insertar los datos en la tabla user_unassignment
    this._speechTherapyService.disableIsland(user_id_patient, island, level).subscribe(
      response => {
        console.log('Isla deshabilitada correctamente:', response);
        alert('Isla deshabilitada correctamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        console.error('Error al deshabilitar isla:', error);
        alert('Error al deshabilitar isla');
      }
    );
  }
}
