import { Component, Input, OnDestroy, OnInit, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartOptions } from '../../../../../shared/models/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: '[app-bar-chart]',
  templateUrl: './bar-chart.component.html',
  standalone: true,
  imports: [AngularSvgIconModule, NgApexchartsModule],
})
export class BarChartComponent implements OnInit, OnDestroy {
  @Input() data: any = <any>{};

  public chartOptions: Partial<ChartOptions>;
  

  constructor(private themeService: ThemeService) {
    let baseColor = '#FFFFFF';
    const data = [2100, 3200, 3200, 2400, 2400, 1800, 1800, 2400, 2400, 3200, 3200, 3000, 3000, 3250, 3250];

    this.chartOptions = {
      title: {
        text: 'holi'
      },
      series: [
        {
          name: 'Etherium',
          data: data,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: 210,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
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
        offsetY: -20,
        formatter: function (val) {
          return (Number(val)/100) + "%";
        },
        style: {
          fontSize: '12px',
          colors: ["#B1CCE0"]
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 1,
          opacityTo: 1,
          stops: [2],
        },
      },
      /* stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor], // line color
      }, */
      xaxis: {
        /* categories: categories, */
        labels: {
          show: false,
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 4,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      colors: [baseColor], //line colors
    };

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      primaryColor = this.HSLToHex(primaryColor);
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.chartOptions.colors = [primaryColor];
      this.chartOptions.stroke!.colors = [primaryColor];
      this.chartOptions.xaxis!.crosshairs!.stroke!.color = primaryColor;
    });
  }

  private HSLToHex(color: string): string {
    const colorArray = color.split('%').join('').split(' ');
    const colorHSL = colorArray.map(Number);
    const hsl = {
      h: colorHSL[0],
      s: colorHSL[1],
      l: colorHSL[2],
    };

    const { h, s, l } = hsl;

    const hDecimal = l / 100;
    const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

      // Convert to Hex and prefix with "0" if required
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
