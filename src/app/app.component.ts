import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule, ApexOptions } from "ng-apexcharts";
import { ThemeService } from './core/services/theme.service';
import { ToastService } from './core/services/toast/toast.service';
import { ToastComponent } from './core/services/toast/toast.component';
import { TextToAudioComponent } from './text-to-audio/text-to-audio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgApexchartsModule, ToastComponent, TextToAudioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pronuntest-front';
  chartOptions : ApexOptions;

  constructor(public themeService: ThemeService, public _toastService: ToastService) {
    
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ] as any,
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };
  }
}
