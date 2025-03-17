import { Component} from '@angular/core';
import { NftHeaderComponent } from '../nft/nft-header/nft-header.component';
import { NftAuctionsTableComponent } from '../nft/nft-auctions-table/nft-auctions-table.component';
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
    NftAuctionsTableComponent,
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
  points: { points: [number, number][] } = {points: []};
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
  /*precisionUserVS = this.createChartConfig(
    [
      { name: '', data: [] },
      { name: '', data: [] },
    ],
    [], // Add categories here
    '',
    true
  );*/
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
    //{ key: 'precisionUserVS', data: this.precisionUserVS },
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
    const descriptions: { 
      [key: string]: { 
        singular: string; 
        plural: string; 
        columnNames: { singular: string[]; plural: string[] } 
      } 
    } = {
      dataCompletPhonemes: {
        singular: 'Cantidad de ejercicios de fonemas completados por el paciente, detallando las categorías finalizadas.',
        plural: 'Número de pacientes que han completado ejercicios de fonemas, incluyendo las categorías finalizadas.',
        columnNames: { singular: ['Categoría de Fonema', 'Ejercicios Completados'], plural: ['Categoría de Fonema', 'Pacientes Completados'] },
      },
      dataPhonemeVS: {
        singular: 'Comparación del rendimiento del paciente en diferentes fonemas, destacando el mejor y peor porcentaje de precisión con la inteligencia artificial.',
        plural: 'Comparación del rendimiento de los pacientes en distintos fonemas, resaltando los mejores y peores porcentajes de precisión con la inteligencia artificial.',
        columnNames: { singular: ['Fonema', 'Porcentaje de Precisión'], plural: ['Fonema', 'Precisión Promedio de Pacientes'] },
      },
      /*precisionUserVS: {
        singular: 'Nivel de precisión del paciente en la pronunciación de distintos fonemas.',
        plural: 'Análisis comparativo de la precisión de varios pacientes en la pronunciación de diferentes fonemas.',
        columnNames: { singular: ['Fonema', 'Precisión del Paciente'], plural: ['Fonema', 'Precisión Promedio'] },
      },*/
      dataCompletGames: {
        singular: 'Cantidad de juegos completados por el paciente, permitiendo evaluar su progreso en la terapia.',
        plural: 'Cantidad de juegos completados por los pacientes, permitiendo evaluar su progreso en la terapia.',
        columnNames: { singular: ['Juego', 'Completado por el Paciente'], plural: ['Juego', 'Pacientes que lo Completaron'] },
      },
      dataCompletGamesLevel: {
        singular: 'Número de niveles de juego completados por el paciente, mostrando su evolución en cada actividad.',
        plural: 'Número de niveles completados en los juegos, diferenciando el desempeño de cada paciente o el avance general del grupo.',
        columnNames: { singular: ['Nivel del Juego', 'Completado por el Paciente'], plural: ['Nivel del Juego', 'Pacientes que lo Completaron'] },
      },
      dataGameTime: {
        singular: 'Tiempo promedio dedicado por el paciente en los juegos de terapia.',
        plural: 'Tiempo promedio invertido en juegos por los pacientes.',
        columnNames: { singular: ['Juego', 'Tiempo Invertido (min)'], plural: ['Juego', 'Tiempo Promedio (min)'] },
      },
      dataTotalIntent: {
        singular: 'Promedio de intentos realizados por el paciente en los juegos, útil para medir su perseverancia y evolución.',
        plural: 'Promedio de intentos realizados en los juegos por los pacientes, útil para medir la perseverancia y evolución grupal.',
        columnNames: { singular: ['Juego', 'Intentos del Paciente'], plural: ['Juego', 'Intentos Promedio'] },
      },
    };

    const isSinglePatient = !!this.selectedUser;
    const worksheetData: any[][] = [];

    if (isSinglePatient) {
      worksheetData.push([{ v: 'Paciente', s: { font: { bold: true }, fill: { fgColor: { rgb: 'D9D9D9' } } } }]);
      worksheetData.push([
        { v: 'Nombre', s: { font: { bold: true } } },
        { v: 'ID', s: { font: { bold: true } } },
        { v: 'Género', s: { font: { bold: true } } },
        { v: 'Edad', s: { font: { bold: true } } },
        { v: 'Condición', s: { font: { bold: true } } },
      ]);
      worksheetData.push([
        this.selectedUser.user_name,
        this.selectedUser.identification,
        this.selectedUser.gender,
        this.selectedUser.age,
        this.selectedUser.condition,
      ]);
      worksheetData.push([]); // Separador
    }

    this.filteredChartsData.forEach(chart => {
      const descriptionData = descriptions[chart.key] || {
        singular: 'Sin descripción',
        plural: 'Sin descripción',
        columnNames: { singular: ['Categoría', 'Valor'], plural: ['Categoría', 'Valor'] }
      };

      const description = isSinglePatient ? descriptionData.singular : descriptionData.plural;
      const columnNames = isSinglePatient ? descriptionData.columnNames.singular : descriptionData.columnNames.plural;

      // Descripción con fondo gris
      worksheetData.push([{ v: `Descripción: ${description}`, s: { font: { bold: true }, fill: { fgColor: { rgb: 'D9D9D9' } } } }]);
      // Encabezados en negrita
      worksheetData.push(columnNames.map(name => ({ v: name, s: { font: { bold: true } } })));

      const rows = chart.data.chart.xaxis.categories.map((category: any, i: number) => [
        { v: category },
        { v: chart.data.chart.series[0].data[i], s: { numFmt: chart.key.includes('Time') ? '0.00' : '0.0%' } } // Formato de número
      ]);
      worksheetData.push(...rows);
      worksheetData.push([]); // Separador
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Autoajustar columnas
    const columnWidths = worksheetData.reduce((acc, row) => {
      row.forEach((cell, i) => {
        const cellValue = typeof cell === 'object' ? cell.v : cell;
        acc[i] = Math.max(acc[i] || 1, cellValue ? 18 : 18);
      });
      return acc;
    }, [] as number[]);

    worksheet['!cols'] = columnWidths.map(w => ({ wch: w }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    const nameReportExcel = isSinglePatient ? `reporte_${this.selectedUser.user_name}` : 'reporte_pacientes';
    XLSX.writeFile(workbook, `${nameReportExcel}.xlsx`);
  }

  // Opciones de filtros
  filterOptions = [
    { key: 'dataCompletPhonemes', label: 'Fonemas Completos', active: true },
    { key: 'dataPhonemeVS', label: 'Fonemas vs Usuarios', active: true },
    //{ key: 'precisionUserVS', label: 'Precisión de Usuarios', active: false },
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
    if (Array.isArray(data)) {
      const validData: any[] = [];
      for (let i = 0; i < data.length; i++) {
          const item = data[i];
          if (item && typeof item === 'object' && 'user_id' in item) {
              validData.push(item);
          }
      }
      if (validData.length) {
          this[target] = validData; // Solo asigna si hay datos válidos
      }
    } else if (data && typeof data === 'object' && 'user_id' in data) {
        this[target] = [data]; // Convierte en array si es un objeto válido
    }
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
      //const dataG3 = this.organizeData(res, 'user_name');
    
      if (dataG2) {
        // Obtener todos los fonemas
        const phonemeKeys = Object.keys(dataG2);

        // Encontrar la longitud máxima en best y worst
        const maxLength = Math.max(
          ...phonemeKeys.map(key => dataG2[key].best.length),
          ...phonemeKeys.map(key => dataG2[key].worst.length)
        );

        // Normalizar los arrays
        phonemeKeys.forEach(key => {
          const lengthDiff = maxLength - dataG2[key].best.length;
          if (lengthDiff > 0) {
            dataG2[key].best.push(...Array(lengthDiff).fill(0));
          }

          const lengthDiffWorst = maxLength - dataG2[key].worst.length;
          if (lengthDiffWorst > 0) {
            dataG2[key].worst.push(...Array(lengthDiffWorst).fill(0));
          }
        });
        // Guardar el objeto normalizado
        const normalizedData = { ...dataG2 };
        // Iterar sobre todas las claves en normalizedData y actualizar la gráfica
        Object.entries(normalizedData).forEach(([key, value]) => {
          this.updateGraphic(
            this.dataPhonemeVS,
            `Exactitud por paciente: Mejor vs peor`,
            [value.best, value.worst], // Se usa el valor normalizado
            value.user_name
          );
        });

      }
  /*
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
      }*/
      
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
      const data = Array.isArray(res) ? res : [res];
      //console.log('>>data', this.points);
      data.forEach((point) => {
        if (point.lat !== 0 && point.lng !== 0) {
          this.points.points.push([point.lng, point.lat]);
          //console.log('>>fetch', this.points);
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
