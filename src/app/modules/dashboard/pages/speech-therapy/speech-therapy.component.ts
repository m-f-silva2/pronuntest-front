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
import { DataItem, OrganizedData, Table } from 'src/app/core/models/interfaces-graphics';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../components/map/map.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';

@Component({
  selector: 'app-speech-therapy',
  standalone: true,
  imports: [
    CommonModule,
    NftHeaderComponent,
    UserModalComponent, 
    NftDualCardComponent, 
    NftSingleCardComponent, 
    NftChartCardComponent, 
    NftAuctionsTableComponent, 
    PieChartComponent, 
    MultiChartComponent,
    MapComponent],
  templateUrl: './speech-therapy.component.html',
  styleUrl: './speech-therapy.component.css'
})
export class SpeechTherapyComponent {
  nft: Array<any> = [];
  fonemas: string[] = ['a', 'e', 'i', 'o', 'u', 'p']; // Lista de items
  activo: string = 'a'; // Inicialmente activo el primer ítem (a)
  points: { points: [[number, number]] } = {points: [[-74.0722, 4.7111]]};

  precisionPhonemeVS: { chart: Partial<ChartOptions>, title: string, options?: string[], isGroups: true } = {
    isGroups: true,
    title: '',
    //options:['Mejor', 'Peor'],
    chart: {
      series: [
        { name: '', data: []},
        { name: '', data: []}
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
        categories: [],
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
  precisionUserVS: { chart: Partial<ChartOptions>, title: string, options?: string[], isGroups: true } = {
    isGroups: true,
    title: '',
    //options:['Mejor', 'Peor'],
    chart: {
      series: [
        { name: '', data: []},
        { name: '', data: []}
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
        categories: [],
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
  
  table: Table[] = [];
  tableModal: Table[] = [];

  repetsF: { chart: Partial<ChartOptions>, title: string, options?: string[] } = {
    title: 'Repetición de fonemas', 
    options:['pa','pe','pi','po','pu','pollo','pulpo','pie','palo','mapa','papa','pelo','pila','lupa','puma','pino','pan'],
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
  private token;

  constructor(private _authService: AuthService, private _speechTherapyService: SpeechTherapyService) {
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
    this.token = this._authService.getToken();
    if (!this.token) return
  }
  
  ngOnInit(): void {
    this.getDataGraphic();
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }

  activarFonema(fonema: string) {
    this.activo = fonema;
  }

  updateDataGraphic(graphic: string, title: string, data: any, categories: any){
    //this.completF.chart.series![0].name = 'Fonemas';
    
    console.log("data "+graphic, data)
    if(data == undefined || data.length == 0){
    }else if(graphic == 'g-1'){
      this.completF.title = title;
      this.completF.chart.series![0].data = data;
      this.completF.chart.xaxis!.categories = categories;
      this.completF = {...this.completF};
      //console.log('>>g-1', this.completF);
    }else if(graphic == 'g-2'){
      this.precisionPhonemeVS.title = title;
      this.precisionPhonemeVS.chart.series![0].name = "Mejor";
      this.precisionPhonemeVS.chart.series![0].data = data[0];
      this.precisionPhonemeVS.chart.series![1].name = "Peor";
      this.precisionPhonemeVS.chart.series![1].data = data[1];
      this.precisionPhonemeVS.chart.xaxis!.categories = categories;
      this.precisionPhonemeVS = {...this.precisionPhonemeVS};
      //console.log("--g-2",this.precisionPhonemeVS);
    }else if(graphic == 'g-3'){
      this.precisionUserVS.title = title;
      this.precisionUserVS.chart.series![0].name = "Mejor";
      this.precisionUserVS.chart.series![0].data = data[0];
      this.precisionUserVS.chart.series![1].name = "Peor";
      this.precisionUserVS.chart.series![1].data = data[1];
      this.precisionUserVS.chart.xaxis!.categories = categories;
      this.precisionUserVS = {...this.precisionUserVS};
      //console.log('>>', this.precisionUserVS);
    }else if(graphic == 'g-4'){
      //console.log("intentos", data, categories);
    }else if(graphic == 't-1'){
      //console.log("tabla", data);
      this.table = [];
      this.table = data;
    }else if(graphic == 't-2'){
      //console.log("tabla", data);
      this.tableModal = [];
      this.tableModal = data;
    }else if(graphic == 'm-1'){
      data.forEach((data: { lng: any; lat: any; }) => {
        if (data.lat !== 0 && data.lng !== 0) {
          this.points.points.push([data.lng, data.lat]);
        }
      });
      //console.log("spee",this.points)
    }
  }
  
  organizeData(data: DataItem[], keyField: keyof DataItem): OrganizedData  | undefined {
    // Verifica que el array de datos no esté vacío
    if (!Array.isArray(data) || data.length === 0) {
      return undefined;
    }

    return data.reduce((acc: OrganizedData, item: DataItem) => {
      const key = item[keyField] as string;
      
      if (!acc[key]) {
        acc[key] = {
          phoneme: [],
          user_name: [],
          users_id: [],
          best: [],
          worst: [],
          intents: []
        };
      }
      
      acc[key].phoneme.push(item.phoneme);
      acc[key].user_name.push(item.user_name);
      acc[key].users_id.push(item.users_id);
      acc[key].best.push(item.best);
      acc[key].worst.push(item.worst);
      acc[key].intents.push(item.intents);
      
      return acc;
    }, {});
  }

  getDataGraphic() {
    /*GRAFICA 1 */
    this._speechTherapyService.dataGraphics({ graphic: 'g-1', valueToSearch: this.token }).subscribe({
      next: (res: {isError: boolean, res: { phoneme: string[], num_completed: number[] }}) => {
        if(res.isError || res.res == undefined) return
        
        var title = "Fonemas completados";
        this.updateDataGraphic('g-1', title, res.res.num_completed, res.res.phoneme)
      },
      error(err) {
        console.error('>> >>  :', err);
      },
    });
    

    /*GRAFICAS 2 Y 3 */
    this._speechTherapyService.dataGraphics({ graphic: 'g-2', valueToSearch: this.token }).subscribe({
      next: (res: {isError: boolean, res: []}) => {
        if(res.isError || res.res == undefined) return
        // Organize by phoneme
        const organizedDataG2 = this.organizeData(res.res, 'phoneme');
        if(organizedDataG2){
          const keys = Object.keys(organizedDataG2);
          //console.log(keys[0],"res",res.res);
          const title1 = `Exactitud ${keys[0]} por paciente: Mejor vs peor`;
          this.updateDataGraphic('g-2', title1, [organizedDataG2[keys[0]].best, organizedDataG2[keys[0]].worst], organizedDataG2[keys[0]].user_name);
        }
        
        
        // Organize by users_name
        const organizedDataG3 = this.organizeData(res.res, 'user_name');
        //console.log('>>g-3', organizedDataG3);
        if(organizedDataG3){
          
          const keysG3 = Object.keys(organizedDataG3);
          const lastKey = keysG3.length-1;
          //console.log(keysG3.length);
          //console.log(keysG3[0],"res",[organizedDataG3[keysG3[0]].best, organizedDataG3[keysG3[0]].worst]);
          
          const title2 = `Exactitud del paciente ${organizedDataG3[keysG3[lastKey]].user_name[0]} por fonemas: Mejor intento vs peor intento`;
          this.updateDataGraphic('g-3', title2, [organizedDataG3[keysG3[lastKey]].best, organizedDataG3[keysG3[lastKey]].worst], organizedDataG3[keysG3[lastKey]].phoneme);
        }
      },
      error(err) {
        console.error('>> >>  :', err);
      },
    });
    /*GRAFICA 4 */
    this._speechTherapyService.dataGraphics({ graphic: 'g-4', valueToSearch: this.token }).subscribe({
      next: (res: {isError: boolean, res: []}) => {
        if(res.isError || res.res == undefined) return
        
        // Organize by phoneme
        const organizedDataByPhoneme:OrganizedData = this.organizeData(res.res, 'phoneme') || {};
        //console.log("phonme",organizedDataByPhoneme['fonema pa'].type_game);
        //const organizedDataG4 = {...organizedDataByPhoneme}
        const organizedDataG4 = Object.keys(organizedDataByPhoneme).reduce((acc: any, key: string) => {
          //console.log("orggg", organizedDataByPhoneme[key]);
          //acc[key] = this.organizeData(organizedDataByPhoneme[key], 'users_name');
          return acc;
        }, {});
        const keys = Object.keys(organizedDataG4);
        const title = `Exactitud ${keys[0]} por paciente: Mejor vs peor`;
        
        //console.log("organized",organizedDataG4);
        //this.updateDataGraphic('g-4', title, [organizedDataG4[keys[0]].best, organizedDataG4[keys[0]].worst], organizedDataG4[keys[0]].users_name);
      },
      error(err) {
        console.error('>> >>  :', err);
      },
    });

    /*TABLA 1*/
    const token = this._authService.getToken();
    this._speechTherapyService.dataGraphics({ graphic: 'g-5', valueToSearch: this.token }).subscribe({
      next: (res: {isError: boolean, res: []}) => {
        if(res.isError || res.res == undefined) return
        
        //this.table = res.res;
        const title = `Exactitud ${res.res.keys} por paciente: Mejor vs peor`;
        this.updateDataGraphic('t-1', title, res.res, '');
      },
      error(err) {
        console.error('>> >>  :', err);
      },
    });
     /*TABLA 2 MODAL*/
    this._speechTherapyService.dataGraphics({ graphic: 'g-7', valueToSearch: this.token }).subscribe({
      next: (res: {isError: boolean, res: []}) => {
        if(res.isError || res.res == undefined) return
        
        //this.table = res.res;
        const title = `Exactitud ${res.res.keys} por paciente: Mejor vs peor`;
        this.updateDataGraphic('t-2', title, res.res, '');
      },
      error(err) {
        console.error('>> >>  :', err);
      },
    });

    /*MAPA 1*/
    this._speechTherapyService.dataGraphics({ graphic: 'g-6', valueToSearch: this.token }).subscribe({
      next: (res: {isError: boolean, res: []}) => {
        if(res.isError || res.res == undefined) return
        
        //this.table = res.res;
        //console.log("res", res.res);
        const title = `Mapa`;
        this.updateDataGraphic('m-1', title, res.res, '');

      },
      error(err) {
        console.error('>> >>  :', err);
      },
    });
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
