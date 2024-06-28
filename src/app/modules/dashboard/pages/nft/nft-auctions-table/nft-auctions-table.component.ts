import { Component, Input, OnInit } from '@angular/core';
import { NftAuctionsTableItemComponent } from '../nft-auctions-table-item/nft-auctions-table-item.component';
import { NgFor } from '@angular/common';
import { Nft } from '../models/nft';
import { Table } from 'src/app/core/models/interfaces-graphics';

@Component({
    selector: '[nft-auctions-table]',
    templateUrl: './nft-auctions-table.component.html',
    standalone: true,
    imports: [NgFor, NftAuctionsTableItemComponent],
})
export class NftAuctionsTableComponent implements OnInit {
  @Input('data') data: Table[] = <any>{};

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
    this.activeAuction = [
      {
        id: 1346771,
        name: 'Camila Perez',
        other: '',
        gender: 'Masculino',
        image:
          'https://lh3.googleusercontent.com/t_S1sM__cKCFbuhbwQ5JHKNRRggKuPH2O3FM_-1yOxJLRzz9VRMAPaVBibgrumZG3qsB1YxEuwvB7r9rl-F-gI6Km9NlfWhecfPS=h500',
        avatar: 'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg',
        date_admission: '14/06/2024',
        progress_now: 'Estable',
        age: 0,
        condition: 'Estable',
      },
      {
        id: 1346772,
        name: 'Josefa Sanchez',
        other: '',
        gender: 'Masculino',
        image:
          'https://lh3.googleusercontent.com/k95IQpeYutx-lYXwgTZw0kXZl9GAkIOc4Yz3Dr06rndWphZ25kSWyF64aTqT3W4cOxz0eB5LfAss5i9WAR-ZPWVaifijsABLqzEYwHY=h500',
        avatar: 'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg',
        date_admission: '14/06/2024',
        progress_now: 'Estable',
        age: 1,
        condition: 'Estable',
      },
      {
        id: 1346780,
        name: 'Andrea Jimenez',
        other: '',
        gender: 'Masculino',
        image:
          'https://lh3.googleusercontent.com/iYNxP1eXG3C6ujTY4REQ9rBea19Z46oKtKkaDS1XA-ED5iFhFmPrvQPzwx8ZwACydCS2wbZ7K1P89XIED3s8JRcT6Pn0M1-sMifeyQ=h500',
        avatar: 'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg',
        date_admission: '14/06/2024',
        progress_now: 'Estable',
        age: 2,
        condition: 'Estable',
      },
      {
        id: 1346792,
        name: 'Alejandro Martinez',
        other: '',
        gender: 'Masculino',
        image:
          'https://lh3.googleusercontent.com/ujFwzDIXN64mJAHZwZ0OgNupowe5jlJPmV8OIrgSDjUAeb3SZRuhsuyPKAw6S2TkUknZvErVVKbzD-rEcs-augb6_LzUE5NVtPxj_w=h500',
        avatar: 'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg',
        date_admission: '14/06/2024',
        progress_now: 'Estable',
        age: 3,
        condition: 'Estable',
      },
      {
        id: 1346792,
        name: 'Mario Gomez',
        other: '',
        gender: 'Masculino',
        image:
          'https://lh3.googleusercontent.com/pwjA4CWS9nto8fCis6JzlWwzQgtHUvLlUWcd501LsGQoVUPL5euwhir-2fjPmsJLJ_ovJ7flH_OgDEaALeZrhSXv8Puq85-lZYWuqto=h500',
        avatar: 'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg',
        date_admission: '14/06/2024',
        progress_now: 'Estable',
        age: 4,
        condition: 'Estable',
      },
    ];
  }

  ngOnInit(): void {}
}
