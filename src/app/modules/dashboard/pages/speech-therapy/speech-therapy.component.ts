import { Component, effect } from '@angular/core';
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
import * as XLSX from 'xlsx';



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
  private token;
  [key: string]: any; // Permite acceder dinámicamente a las propiedades
  nft: Array<any> = [];
  fonemas: string[] = ['a', 'e', 'i', 'o', 'u', 'p']; // Lista de items
  activo: string = 'a'; // Inicialmente activo el primer ítem (a)
  points: { points: [[number, number]] } = {points: [[-74.0722, 4.7111]]};
  table: Table[] = [];
  tableModal: Table[] = [];
  isModalOpen = false;
  baseChartOptions: Partial<ChartOptions> = {
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
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: ["#B1CCE0"],
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val}$`,
      },
    },
    colors: ['#FFFFFF'],
  };
  dataCompletPhonemes = this.createChartConfig(
    [{ name: 'Fonemas', data: [] }],
    [], // ['pa', 'pe', ...],
    'Fonemas completados'
  );
  dataPhonemeVS = this.createChartConfig(
    [
      { name: '', data: [] },
      { name: '', data: [] },
    ],
    [], // Add categories here
    '',
    true
  );
  precisionUserVS = this.createChartConfig(
    [
      { name: '', data: [] },
      { name: '', data: [] },
    ],
    [], // Add categories here
    '',
    true
  );
  dataCompletGames = this.createChartConfig(
    [{ name: 'Juegos', data: [] }],
    [], // ['pa', 'pe', ...],
    'Juegos completados'
  );
  dataCompletGamesLevel = this.createChartConfig(
    [{ name: 'Niveles', data: [] }],
    [], // ['pa', 'pe', ...],
    'Niveles completados'
  );
  dataGameTime = this.createChartConfig(
    [{ name: 'Tiempo por nivel', data: [] }],
    [], // ['pa', 'pe', ...],
    'Tiempo jugado por nivel'
  );
  dataTotalIntent = this.createChartConfig(
    [{ name: 'Total intentos', data: [] }],
    [], // ['pa', 'pe', ...],
    'Total intentos por nivel'
  );

  chartsData = [
    { key: 'dataCompletPhonemes', data: this.dataCompletPhonemes },
    { key: 'dataPhonemeVS', data: this.dataPhonemeVS },
    { key: 'precisionUserVS', data: this.precisionUserVS },
    { key: 'dataCompletGames', data: this.dataCompletGames },
    { key: 'dataCompletGamesLevel', data: this.dataCompletGamesLevel },
    { key: 'dataGameTime', data: this.dataGameTime },
    { key: 'dataTotalIntent', data: this.dataTotalIntent },
  ];
  public selectedUser: any = null;

  // Manejar el evento de selección de usuario
  onUserSelected(user: any): void {
    this.selectedUser = user;
    console.log('Usuario seleccionado speech:', this.selectedUser);
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  clearSelectedUser(): void {
    this.selectedUser = null;
    console.log('Usuario deseleccionado');
  }
  
  
  generateExcel() {
    // Mapeo de descripciones por clave
    const descriptions: { [key: string]: string } = {
      dataCompletPhonemes: 'Cantidad de pacientes que completaron y la categoría que completaron',
      dataPhonemeVS: 'Comparación general entre mejor y peor porcentaje del usuario al usar la inteligencia artificial',
      precisionUserVS: 'Comparación del porcentaje de precisión de los usuarios en distintos fonemas',
      dataCompletGames: 'Cantidad de pacientes que completaron cada juego',
      dataCompletGamesLevel: 'Cantidad de pacientes que completaron cada nivel',
      dataGameTime: 'Tiempo promedio invertido en juegos',
      dataTotalIntent: 'Promedio de intentos totales en los juegos',
    };
  
    // Convertir los datos filtrados a hojas de trabajo
    const worksheetData: any[][] = [];
  
    // Agregar datos del usuario seleccionado (si existe)
    if (this.selectedUser) {
      worksheetData.push(['Información del Usuario']);
      worksheetData.push(['Nombre', 'Identificación', 'Género', 'Edad', 'Condición']);
      worksheetData.push([
        this.selectedUser.user_name,
        this.selectedUser.identification,
        this.selectedUser.gender,
        this.selectedUser.age,
        this.selectedUser.condition,
      ]);
      worksheetData.push([]); // Fila vacía para separar
    }
  
    // Agregar datos de gráficos
    this.filteredChartsData.forEach(chart => {
      const description = descriptions[chart.key] || 'Sin descripción';
  
      // Agregar descripción y datos del gráfico
      worksheetData.push([`Descripción: ${description}`]);
      worksheetData.push(['Categoría', 'Valor']);
      const rows = chart.data.chart.xaxis.categories.map((category: any, i: number) => [
        category,
        chart.data.chart.series[0].data[i],
      ]);
      worksheetData.push(...rows);
      worksheetData.push([]); // Fila vacía para separar
    });
  
    // Crear hoja de trabajo
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Crear el libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
    // Exportar a un archivo Excel
    const nameReportExcel = 'pronun_excel';
    XLSX.writeFile(workbook, `${nameReportExcel}.xlsx`);
  }
  
  
  // Opciones de filtros
  filterOptions = [
    { key: 'dataCompletPhonemes', label: 'Fonemas Completos', active: true },
    { key: 'dataPhonemeVS', label: 'Fonemas vs Usuarios', active: true },
    { key: 'precisionUserVS', label: 'Precisión de Usuarios', active: true },
    { key: 'dataCompletGames', label: 'Juegos Completos', active: true },
    { key: 'dataCompletGamesLevel', label: 'Niveles Completos', active: true },
    { key: 'dataGameTime', label: 'Tiempo de Juegos', active: true },
    { key: 'dataTotalIntent', label: 'Intentos Totales', active: true },
    { key: 'map', label: 'Mapa', active: true },
    { key: 'table', label: 'Tabla', active: true },
    // Nuevos filtros de progreso en juegos
    /*{ key: 'gameLevel', label: 'Nivel de Juego', active: true },
    { key: 'attemptsPerLevel', label: 'Intentos por Nivel', active: true },
    { key: 'totalProgress', label: 'Porcentaje de Avance Total', active: true },
    { key: 'precisionResults', label: 'Precisión por Nivel', active: true },*/
  ];

  // Datos filtrados
  filteredChartsData = this.chartsData;

  // Visibilidad del mapa y tabla
  isMapVisible = true;
  isTableVisible = true;

  // Alternar filtros
  toggleFilter(key: string): void {
    // Buscar el filtro por clave
    const filter = this.filterOptions.find(f => f.key === key);
    if (filter) {
      filter.active = !filter.active;

      if (key === 'map') {
        this.isMapVisible = filter.active;
      } else if (key === 'table') {
        this.isTableVisible = filter.active;
      } else {
        this.updateFilteredCharts();
      }
    }
  }

  // Actualizar datos filtrados
  updateFilteredCharts(): void {
    const activeFilters = this.filterOptions
      .filter(filter => filter.active)
      .map(filter => filter.key);

    this.filteredChartsData = this.chartsData.filter(chart => activeFilters.includes(chart.key));
  }
  
  createChartConfig(series: any[], categories: string[], title: string, isGroups = false): any {
    return {
      isGroups,
      title,
      chart: {
        ...this.baseChartOptions,
        series,
        xaxis: {
          type: 'category',
          categories,
        },
      },
    };
  }

  openModal() {
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }

  activarFonema(fonema: string) {
    this.activo = fonema;
  }

  updateGraphic(graphicConfig: any, title: string, data: any[], categories: any[]) {
    graphicConfig.title = title;
    graphicConfig.chart.series[0].data = data[0] || [];
    if (data[1]) graphicConfig.chart.series[1].data = data[1];
    graphicConfig.chart.xaxis.categories = categories;
    Object.assign(graphicConfig, { ...graphicConfig }); // For reactivity
  }
  
  updateTable(target: string, data: any[]) {
    this[target] = [...data];
  }

  fetchData(graphic: string, callback: (res: any) => void) {
    this._speechTherapyService.dataGraphics({ graphic, valueToSearch: this.token }).subscribe({
      next: (res) => {
        if (!res.isError && res.res) callback(res.res);
      },
      error: (err) => console.error(`Error in graphic ${graphic}:`, err),
    });
  }

  getDataGraphic() {
    /* GRAFICA 1 */
    this.fetchData('g-1', (res: { phoneme: string[]; num_completed: number[] }) => {
      this.updateGraphic(this.dataCompletPhonemes, 'Fonemas completados', [res.num_completed], res.phoneme);
    });
  
    /* GRAFICAS 2 Y 3 */
    this.fetchData('g-2', (res: any[]) => {
      const dataG2 = this.organizeData(res, 'phoneme');
      const dataG3 = this.organizeData(res, 'user_name');
    
      if (dataG2) {
        const keys = Object.keys(dataG2);
        this.updateGraphic(
          this.dataPhonemeVS,
          `Exactitud ${keys[0]} por paciente: Mejor vs peor`,
          [dataG2[keys[0]].best, dataG2[keys[0]].worst],
          dataG2[keys[0]].user_name
        );
      }
  
      if (dataG3) {
        const lastKey = Object.keys(dataG3).pop();
        if (lastKey) {
          this.updateGraphic(
            this.precisionUserVS,
            `Exactitud del paciente ${dataG3[lastKey].user_name[0]} por fonemas: Mejor intento vs peor intento`,
            [dataG3[lastKey].best, dataG3[lastKey].worst],
            dataG3[lastKey].phoneme
          );
        }
      }
      console.log('>>', this.precisionUserVS);
    });

    /* GRAFICA 4 */
    this.fetchData('g-1', (res: { phoneme: string[]; num_completed: number[] }) => {
      this.updateGraphic(this.dataCompletGames, 'Juegos completados', [res.num_completed], res.phoneme);
    });

    /* GRAFICA 5 */
    this.fetchData('g-1', (res: { phoneme: string[]; num_completed: number[] }) => {
      this.updateGraphic(this.dataCompletGamesLevel, 'Niveles completados', [res.num_completed], res.phoneme);
    });
    /* GRAFICA 6 */
    this.fetchData('g-1', (res: { phoneme: string[]; num_completed: number[] }) => {
      this.updateGraphic(this.dataGameTime, 'Tiempo jugado', [res.num_completed], res.phoneme);
    });
    /* GRAFICA 7 */
    this.fetchData('g-1', (res: { phoneme: string[]; num_completed: number[] }) => {
      this.updateGraphic(this.dataTotalIntent, 'Total intentos', [res.num_completed], res.phoneme);
    });
  
    /* TABLA 1 */
    this.fetchData('g-5', (res: any[]) => {
      this.updateTable('table', res);
    });
  
    /* TABLA 2 MODAL */
    this.fetchData('g-7', (res: any[]) => {
      this.updateTable('tableModal', res);
    });
  
    /* MAPA 1 */
    this.fetchData('g-6', (res: { lng: any; lat: any }[]) => {
      res.forEach((point) => {
        if (point.lat !== 0 && point.lng !== 0) {
          this.points.points.push([point.lng, point.lat]);
        }
      });
    });
    
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
  
  isFiltersVisible = false;

  ngOnInit(): void {
    this.getDataGraphic();
    
    // Mostrar los filtros después de 3 segundos
    setTimeout(() => {
      this.isFiltersVisible = true;
    }, 3000); // Ajusta el tiempo según lo necesario
  }

  // Funciones de manejo de datos y gráficos...

  constructor(private _authService: AuthService, private _speechTherapyService: SpeechTherapyService) {
    this.token = this._authService.getToken();
    if (!this.token) return;
  }
}
