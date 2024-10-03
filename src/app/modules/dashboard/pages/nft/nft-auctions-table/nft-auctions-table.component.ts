import { Component, Input, OnInit } from '@angular/core';
import { NftAuctionsTableItemComponent } from '../nft-auctions-table-item/nft-auctions-table-item.component';
import { NgFor } from '@angular/common';
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
    
  }

  ngOnInit(): void {}

  filteredData: any[] = this.data;

  filterTable(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.data.filter(auction => 
      auction.user_name.toLowerCase().includes(searchTerm) || 
      auction.identification.toString().includes(searchTerm) ||
      auction.gender.toLowerCase().includes(searchTerm) ||
      auction.condition.toLowerCase().includes(searchTerm)
    );
    console.log(this.data, "  -- ", this.filteredData);
  }
}
