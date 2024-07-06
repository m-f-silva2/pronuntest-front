import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';



@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];
}
