import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NftAuctionsTableItemComponent } from '../nft-auctions-table-item/nft-auctions-table-item.component';
import { CommonModule } from '@angular/common';
import { Table } from 'src/app/core/models/interfaces-graphics';

@Component({
    selector: '[nft-auctions-table]',
    templateUrl: './nft-auctions-table.component.html',
    standalone: true,
    imports: [CommonModule, NftAuctionsTableItemComponent],
})
export class NftAuctionsTableComponent implements OnInit {
  @Input('data') data: Table[] = <any>{};
  @Input() isAssignUser = <Boolean> false;
  @Input() isUnAssignUser = <Boolean> false;
  @Input() isIslandManager = <Boolean> false;
  @Output() userSelected = new EventEmitter<Table>();
  // Lista que se muestra en la tabla, filtrada por el buscador
  public filteredData: Table[] = this.data;

  public activeAuction: {
    name: string,
    other: string,
    image: string,
    avatar: string,
    id: number|string,
    gender: string,
    age: number,
    condition: string,
    date_admission: string,
    progress_now: string
  }[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  // Método para filtrar la tabla
  filterTable(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    // Filtrar por diferentes campos (nombre, identificación, género, condición)
    this.filteredData = this.data.filter(auction => 
      auction.user_name.toLowerCase().includes(searchTerm) || 
      auction.identification.toString().includes(searchTerm) ||
      auction.gender.toLowerCase().includes(searchTerm) ||
      auction.condition.toLowerCase().includes(searchTerm)
    );
    console.log('>>', this.filteredData);
  }

  // Método para seleccionar un usuario
  selectUser(event: Event, auction: any): void {
    event.preventDefault(); // Evita el comportamiento predeterminado
    //console.log('Usuario seleccionado:', auction);
    this.userSelected.emit(auction);
  }
}
