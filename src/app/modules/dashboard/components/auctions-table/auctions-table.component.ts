import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuctionsTableItemComponent } from '../auctions-table-item/auctions-table-item.component';
import { iDashboard } from '../../models/dashboard';

@Component({
  selector: 'app-auctions-table',
  standalone: true,
  imports: [NgFor, AuctionsTableItemComponent],
  templateUrl: './auctions-table.component.html',
  styleUrl: './auctions-table.component.css'
})
export class AuctionsTableComponent implements OnInit {
  public activeAuction: iDashboard[] = [];

  constructor() {
    this.activeAuction = [
      {
        id: 1346771,
        title: 'Mario Zapata',
        creator: 'mario@mail.com',
        image:
          'assets/icons/heroicons/outline/user-circle.svg',
        avatar: 'Fonema p completado',//fonema
        ending_in: '22/04/2024',//fecha
        last_bid: "CP",
        price: '5 años',
        instant_price: 'Masculino',//genero
      }
    ];
  }

  ngOnInit(): void {}
}
