import { Component, Input, OnInit } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Nft } from '../models/nft';
import { Table } from 'src/app/core/models/interfaces-graphics';

@Component({
    selector: '[nft-auctions-table-item]',
    templateUrl: './nft-auctions-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule, CurrencyPipe],
})
export class NftAuctionsTableItemComponent implements OnInit {
  @Input() auction = <Table>{};

  constructor() {
  }

  ngOnInit(): void {}

  getImage(): string {
    return this.auction.image === undefined ? 'assets/icons/heroicons/outline/users.svg' : (this.auction.image === null ? 'assets/icons/heroicons/outline/users.svg' : this.auction.image);
  }
  getGenderText(): string {
    return this.auction.gender === 'm' ? 'Masculino' : (this.auction.gender === 'f' ? 'Femenino' : '');
  }
}
