import { Component, Input, OnInit } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Nft } from '../models/nft';

@Component({
    selector: '[nft-auctions-table-item]',
    templateUrl: './nft-auctions-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule, CurrencyPipe],
})
export class NftAuctionsTableItemComponent implements OnInit {
  @Input() auction = <{
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
  }>{};

  constructor() {}

  ngOnInit(): void {}
}
