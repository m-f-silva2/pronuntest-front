import { Component } from '@angular/core';
import { NftHeaderComponent } from '../nft/nft-header/nft-header.component';
import { NftDualCardComponent } from '../nft/nft-dual-card/nft-dual-card.component';
import { NftSingleCardComponent } from '../nft/nft-single-card/nft-single-card.component';
import { NftAuctionsTableComponent } from '../nft/nft-auctions-table/nft-auctions-table.component';
import { NftChartCardComponent } from '../nft/nft-chart-card/nft-chart-card.component';
import { SpeechTherapyService } from './speech-therapy.service';
import { BarChartComponent } from '../nft/bar-chart/bar-chart.component';
import { MultiChartComponent } from '../nft/multi-chart/multi-chart.component';
import { ChartOptions } from 'src/app/shared/models/chart-options';

@Component({
  selector: 'app-speech-therapy',
  standalone: true,
  imports: [NftHeaderComponent,NftDualCardComponent,NftSingleCardComponent,NftChartCardComponent,NftAuctionsTableComponent,BarChartComponent, MultiChartComponent ],
  templateUrl: './speech-therapy.component.html',
  styleUrl: './speech-therapy.component.css'
})
export class SpeechTherapyComponent {
  nft: Array<any> = [];
  repetsF: { chart: Partial<ChartOptions>, title: string, options?: string[] } = {title: 'Fonemas completados', chart: {
    series: [
      {
        name: 'Fonemas',
        data: [3,2,1,1,2,3,3,1,3,1],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: 270,
      /* toolbar: {
        show: false,
      }, */
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: ["#B1CCE0"]
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Camila Perez','Josefa Sanchez','Andrea Jimenez','Alejandro Martinez','Mario Gomez','Nicolas Lopez','Andrea Correa','Jhon Casanova','Diego Urrutia','Carol Uchoa'],
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return val + '$';
        },
      },
    },
    colors: ['#FFFFFF'], //line colors
  }

  }
  

  constructor(private _speechTherapyService: SpeechTherapyService){
    this.nft = [
      {
        id: 34356771,
        title: 'Girls of the Cartoon Universe',
        creator: 'Jhon Doe',
        instant_price: 4.2,
        price: 187.47,
        ending_in: '06h 52m 47s',
        last_bid: 0.12,
        image: './assets/images/img-01.jpg',
        avatar: './assets/avatars/avt-01.jpg',
      },
      {
        id: 34356772,
        title: 'Pupaks',
        price: 548.79,
        last_bid: 0.35,
        image: './assets/images/img-02.jpg',
      },
      {
        id: 34356773,
        title: 'Seeing Green collection',
        price: 234.88,
        last_bid: 0.15,
        image: './assets/images/img-03.jpg',
      },
    ];

  }

  async ngOnInit(){
    const data = await this._speechTherapyService.getTest()
    console.log('>> >>  data:', data);

    /* this._speechTherapyService.test.bind((res: any) => {
        console.log('>> >>  res:', res);
    }) */
  }

  change(){
    console.log('>> >>  :', this._speechTherapyService.test().test);
    this._speechTherapyService.test.set({test: 'hola'})
  }
}
