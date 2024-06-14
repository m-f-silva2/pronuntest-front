import { Component, Input, OnDestroy, OnInit, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartOptions } from '../../../../../shared/models/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: '[app-multi-chart]',
  templateUrl: './multi-chart.component.html',
  standalone: true,
  imports: [AngularSvgIconModule, NgApexchartsModule],
})
export class MultiChartComponent implements OnInit, OnDestroy {
  @Input() data: { chart: Partial<ChartOptions>, title: string, options?: string[], isGroups?: boolean }  = <any>{};
  optionSelected = 0
  series: any[] = []
  constructor(private themeService: ThemeService) {
    effect(() => {
      if(this.data.chart.plotOptions?.bar?.borderRadius){
        this.data.chart.plotOptions!.bar!.borderRadius = 9-((this.data.chart.series![0].data.length * (this.data.chart.series!.length * (this.data.options?0:1) ))*0.2)
      }

      if(this.data.isGroups){
        this.series = this.data.chart.series!
      }else{
        this.series = [ this.data.chart.series![this.optionSelected] ]
      }

      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      primaryColor = this.HSLToHex(primaryColor);
      this.data.chart.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.data.chart.colors = [primaryColor];
      /* this.data.chart.stroke!.colors = [primaryColor]; */
      /* this.data.chart.xaxis!.crosshairs!.stroke!.color = primaryColor; */
    });
  }

  handleSelectSerie(option: any){
    this.optionSelected = option.value
    
    if(this.data.isGroups){
      this.series = this.data.chart.series!
    }else{
      this.series = [ this.data.chart.series![this.optionSelected] ]
    }
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
