import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Table } from 'src/app/core/models/interfaces-graphics';
import { NftAuctionsTableComponent } from '../../pages/nft/nft-auctions-table/nft-auctions-table.component';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, NftAuctionsTableComponent],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent {
  @Input('data') data: Table[] = <any>{};
  isModalOpen = false;
  
  ngOnInit():void{
  }

  users = [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com' },
    { id: 2, name: 'María García', email: 'maria.garcia@example.com' },
    { id: 3, name: 'Carlos Sánchez', email: 'carlos.sanchez@example.com' },
    // Agrega más usuarios según sea necesario
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
