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
    imports: [AngularSvgIconModule, CurrencyPipe, CommonModule],
})
export class NftAuctionsTableItemComponent implements OnInit {
  @Input() auction = <Table>{};
  @Input() isAssignmentUser = <Boolean> false;

  constructor(private _speechTherapyService: SpeechTherapyService) {
  }

  ngOnInit(): void {}

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
      },
      error => {
        console.error('Error al asignar paciente:', error);
        alert('Error al asignar paciente');
      }
    );
  }
}
