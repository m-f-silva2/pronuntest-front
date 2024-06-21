import { Component } from '@angular/core';
import { NftHeaderComponent } from '../nft/nft-header/nft-header.component';
import { NftDualCardComponent } from '../nft/nft-dual-card/nft-dual-card.component';
import { NftSingleCardComponent } from '../nft/nft-single-card/nft-single-card.component';
import { NftAuctionsTableComponent } from '../nft/nft-auctions-table/nft-auctions-table.component';
import { NftChartCardComponent } from '../nft/nft-chart-card/nft-chart-card.component';

import { PieChartComponent } from '../nft/pie-chart/pie-chart.component';
import { MultiChartComponent } from '../nft/multi-chart/multi-chart.component';
import { ChartOptions } from 'src/app/shared/models/chart-options';
import { SpeechTherapyService } from 'src/app/core/services/dashboard/speech-therapy.service';

@Component({
  selector: 'app-speech-therapy',
  standalone: true,
  imports: [NftHeaderComponent, NftDualCardComponent, NftSingleCardComponent, NftChartCardComponent, NftAuctionsTableComponent, PieChartComponent, MultiChartComponent],
  templateUrl: './speech-therapy.component.html',
  styleUrl: './speech-therapy.component.css'
})
export class SpeechTherapyComponent {
  nft: Array<any> = [];
  precisionVS: { chart: Partial<ChartOptions>, title: string, options?: string[], isGroups: true } = {
    isGroups: true,
    title: 'Exactitud fonema por paciente: Mejor vs peor',
    chart: {
      series: [
        { name: 'Mejor', data: [90,85,95,80,90,95,85,90,90,95]},
        { name: 'Peor',  data: [70,65,70,60,70,75,70,75,65,75]},
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: 270,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4.9,
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
        categories: ['Camila Perez', 'Josefa Sanchez', 'Andrea Jimenez', 'Alejandro Martinez', 'Mario Gomez', 'Nicolas Lopez', 'Andrea Correa', 'Jhon Casanova', 'Diego Urrutia', 'Carol Uchoa'],
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      colors: ['#FFFFFF'],
    }
  }

  precision: { chart: Partial<ChartOptions>, title: string, options?: string[] } = {
    title: 'Exactitud por paciente', options:[
      'Paciente 1',
      'Paciente 2',
      'Paciente 3',
      'Paciente 4',
      'Paciente 5',
      'Paciente 6',
      'Paciente 7',
      'Paciente 8',
      'Paciente 9',
      'Paciente 10',
    ],
    chart: {
      series: [
        { name: 'Paciente 1',   data: [85,90,75,80,95]},
        { name: 'Paciente 2',   data: [75,80,70,85,90]},
        { name: 'Paciente 3',   data: [95,85,90,80,75]},
        { name: 'Paciente 4',   data: [80,75,65,70,85]},
        { name: 'Paciente 5',   data: [90,95,80,85,90]},
        { name: 'Paciente 6',   data: [70,75,85,80,70]},
        { name: 'Paciente 7',   data: [85,80,95,90,80]},
        { name: 'Paciente 8',   data: [80,90,70,75,85]},
        { name: 'Paciente 9',   data: [75,70,80,85,75]},
        { name: 'Paciente 10',  data: [90,85,75,80,95]},
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'pie',
        height: 270,
        toolbar: {
          show: false,
        },
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
        categories: ['Exactitud IA - "pollo" (%)', 'Exactitud IA - "pie" (%)', 'Exactitud IA - "palo" (%)', 'Exactitud IA - "pulpo" (%)', 'Exactitud IA - "mapa" (%)'],
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      colors: ['#FFFFFF'],
    }
  }

  repetsF: { chart: Partial<ChartOptions>, title: string, options?: string[] } = {
    title: 'Repetición de fonemas', options:['pa','pe','pi','po','pu','pollo','pulpo','pie','palo','mapa','papa','pelo','pila','lupa','puma','pino','pan'],
    chart: {
      series: [
        { name: 'pa', data: [2,1,1,1,1,1,1,1,1,1] },
        { name: 'pe', data: [1,1,1,1,1,1,1,1,1,1] },
        { name: 'pi', data: [3,1,1,1,1,1,1,1,1,1] },
        { name: 'po', data: [1,1,0,0,1,0,1,0,1,1] },
        { name: 'pu', data: [0,0,1,1,1,1,1,1,1,1] },
        { name: 'pollo', data: [3,2,1,1,2,3,3,1,3,1] },
        { name: 'pulpo', data: [2,0,1,3,1,2,1,2,1,2] },
        { name: 'pie', data: [1,1,2,2,3,1,2,0,3,0] },
        { name: 'palo', data: [0,2,3,1,1,2,2,3,0,2] },
        { name: 'mapa', data: [2,0,2,2,2,1,3,1,2,1] },
        { name: 'papa', data: [0,3,1,3,1,3,1,0,3,1] },
        { name: 'pelo', data: [1,0,3,2,2,2,1,3,1,3] },
        { name: 'pila', data: [0,2,1,0,1,1,2,1,2,1] },
        { name: 'lupa', data: [0,2,2,1,1,0,1,1,1,1] },
        { name: 'puma', data: [2,0,1,1,2,2,3,0,1,3] },
        { name: 'pino', data: [3,2,0,2,2,1,2,3,0,2] },
        { name: 'pan', data: [0,1,3,1,0,3,0,3,1,2] },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: 270,
        toolbar: {
          show: false,
        },
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
        categories: ['Camila Perez', 'Josefa Sanchez', 'Andrea Jimenez', 'Alejandro Martinez', 'Mario Gomez', 'Nicolas Lopez', 'Andrea Correa', 'Jhon Casanova', 'Diego Urrutia', 'Carol Uchoa'],
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      colors: ['#FFFFFF'],
    }
  }
  
  completF: { chart: Partial<ChartOptions>, title: string, options?: string[] } = {
    title: 'Fonemas completados', 
    chart: {
      series: [
        {
          name: 'Fonemas',
          data: [],//[10,10,10,6,8,10,9,8,8,9,8,9,8,8,8,8,7],
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: 270,
        toolbar: {
          show: false,
        },
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
        categories: [],//['pa','pe','pi','po','pu','pollo','pulpo','pie','palo','mapa','papa','pelo','pila','lupa','puma','pino','pan'],
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      colors: ['#FFFFFF'],
    }
  }


  constructor(private _speechTherapyService: SpeechTherapyService) {
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
  
  ngOnInit(): void {
    this.obtenerDatosGrafico();
  }


  obtenerDatosGrafico() {
    this._speechTherapyService.dataGraphic("db").subscribe(
      res => {
         // Imprime la respuesta en la consola
        // Aquí puedes manejar los datos como los necesites
        console.log("funcion 1",this.completF.chart.series![0].data,this.completF.chart.xaxis?.categories);
        this.completF.chart.series![0].data = res.data;
        this.completF.chart.xaxis!.categories = res.categories;
        console.log("funcion",this.completF.chart.series![0].data,this.completF.chart.xaxis?.categories);
      },
      error => {
        console.error('Error al obtener los datos del gráfico:', error);
        // Aquí puedes manejar el error de manera adecuada
      }
    );
  }

  /*async ngOnInit() {
    const data = await this._speechTherapyService.getTest()

    /* this._speechTherapyService.test.bind((res: any) => {
        console.log('>> >>  res:', res);
    }) /
  }

  change() {
    this._speechTherapyService.test.set({ test: 'hola' })
  }*/
}
