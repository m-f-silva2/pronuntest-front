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
      },
      {
        id: 1346772,
        title: 'Leidy Cardona',
        creator: 'laeidy@mail.com',
        image:
          'assets/icons/heroicons/outline/user-circle.svg',
        avatar: 'Fonema i completado',//fonema
        ending_in: '12/05/2024',//fecha
        last_bid: "CLP",
        price: '8 años',
        instant_price: 'Femenino',
      },
      {
        id: 1346780,
        title: 'Brayan Jimenez',
        creator: 'brjimen@mail.com',
        image:
          'assets/icons/heroicons/outline/user-circle.svg',
        avatar: 'Fonema a completado',//fonema
        ending_in: '22/05/2024',//fecha
        last_bid: "CLP",
        price: '6 años',
        instant_price: 'Masculino',
      },
      {
        id: 1346792,
        title: 'Alejandra Lopez',
        creator: 'aleja@mail.com',
        image:
          'assets/icons/heroicons/outline/user-circle.svg',
        avatar: 'Fonema o completado',//fonema
        ending_in: '29/03/2024',//fecha
        last_bid: "CP",
        price: '4 años',
        instant_price: 'Femenino',
      },
      /*{
        id: 1346792,
        title: 'Crypto Coven',
        creator: 'Jenny Wilson',
        image:
          'https://lh3.googleusercontent.com/pwjA4CWS9nto8fCis6JzlWwzQgtHUvLlUWcd501LsGQoVUPL5euwhir-2fjPmsJLJ_ovJ7flH_OgDEaALeZrhSXv8Puq85-lZYWuqto=h500',
        avatar: 'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg',
        ending_in: '1h 05m 00s',
        last_bid: 0.8,
        price: 1278.38,
        instant_price: 0.35,
      },*/
    ];
  }

  ngOnInit(): void {}
}
