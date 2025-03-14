import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AudiosManagerService } from './audios-manager.service';
import { SupabaseService } from 'src/app/core/services/supabase/supabase.service';
import { Table, User } from 'src/app/core/models/interfaces-graphics';
import { SpeechTherapyService } from 'src/app/core/services/dashboard/speech-therapy.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audios-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audios-manager.component.html',
  styleUrl: './audios-manager.component.css'
})
export class AudiosManagerComponent {
  patients: any[] = [];
  filteredPatients: any[] = [];
  audios: any[] = [];
  token;
  table: Table[] = [];
  isTableVisible = true;
  searchTerm: string = '';

  constructor(
    private _authService: AuthService,
    private audioService: AudiosManagerService,
    private supabaseService: SupabaseService,
    private _speechTherapyService: SpeechTherapyService
  ) {
    this.token = this._authService.getToken();
    if (!this.token) return;
  }

  ngOnInit() {
    this.getDataGraphic();
  }

  updateTable(data: any[]) {
    //this.table = [...data];
    if (Array.isArray(data)) {
      const validData: any[] = [];
      for (let i = 0; i < data.length; i++) {
          const item = data[i];
          if (item && typeof item === 'object' && 'user_id' in item) {
              validData.push(item);
          }
      }
      if (validData.length) {
          this.table = validData; // Solo asigna si hay datos válidos
      }
    } else if (data && typeof data === 'object' && 'user_id' in data) {
        this.table = [data]; // Convierte en array si es un objeto válido
    }
    this.loadAudios();
  }

  fetchDataTable(graphic: string, callback: (res: any) => void) {
    this._speechTherapyService.dataGraphics({ graphic, valueToSearch: this.token }).subscribe({
      next: (res) => {
        if (!res.isError && res.res) callback(res.res);
      },
      error: (err) => console.error(`Error en gráfico ${graphic}:`, err),
    });
  }

  getDataGraphic() {
    this.fetchDataTable('g-5', (res: any[]) => {
      this.updateTable(res);
    });
  }

  async loadAudios() {
    try {
      if (!this.table || this.table.length === 0) return;
      const patientAudios = await Promise.all(
        this.table.map(async (patient) => {
          const audios = await this.supabaseService.getPatientAudios(patient.identification+'');
          return { ...patient, audios };
        })
      );

      this.patients = patientAudios;
      this.filterPatients(); // Filtrar pacientes al cargar
    } catch (error) {
      console.error('Error al cargar los audios:', error);
    }
  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(patient =>
      patient.user_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  downloadAudio(audioUrl: string, fileName: string) {
    this.audioService.downloadAudio(audioUrl, fileName);
  }
}


