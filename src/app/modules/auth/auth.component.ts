import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularSvgIconModule, SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [AngularSvgIconModule, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent implements OnInit {
  constructor(private readonly svgIconRegistry: SvgIconRegistryService) {
    // Registra tus iconos SVG aquí
    this.svgIconRegistry.addSvg('my-icon', 'assets/icons/bell.svg');

  }

  ngOnInit(): void {}
}