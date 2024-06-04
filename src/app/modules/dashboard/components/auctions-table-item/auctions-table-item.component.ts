import { Component, Input, OnInit } from '@angular/core';
import { iDashboard } from '../../models/dashboard';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-auctions-table-item',
  standalone: true,
  imports: [AngularSvgIconModule, CurrencyPipe],
  templateUrl: './auctions-table-item.component.html',
  styleUrl: './auctions-table-item.component.css'
})
export class AuctionsTableItemComponent implements OnInit{
  @Input() auction = <iDashboard>{};

  constructor() {}

  ngOnInit(): void {}
}
