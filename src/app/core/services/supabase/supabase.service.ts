import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';



@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = 'https://notndzwnoflgizewsgys.supabase.co'
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdG5kendub2ZsZ2l6ZXdzZ3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwOTUxODEsImV4cCI6MjAyOTY3MTE4MX0._Cv-id_myh3WWKUvgv1XGLJ8AzkbfD8QyGvwf_46ETw'
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);

  constructor() {}

  async uploadAudio(file: File): Promise<any> {
    
    const fileName = `${new Date().getTime()}-${file.name}`;
    const pathFile = `raw/app/${fileName}`;
    const { data, error } = await this.supabase.storage
      .from('pronunt-storage')  // Asegúrate de tener un bucket llamado 'audios' en Supabase
      .upload(pathFile, file);

    if (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
    return data;
  }

    /**
   * Obtiene la lista de audios de un paciente filtrando por identificación dentro del nombre del archivo.
   * @param patientId Identificación del paciente (obtenida desde `localStorage`).
   */
  async getPatientAudios(patientId: string): Promise<any[]> {
    try {
      // Obtener la lista de todos los archivos en el bucket "pronunt-storage"
      const { data, error } = await this.supabase
        .storage
        .from('pronunt-storage')
        .list('raw/app');

      if (error) {
        console.error('Error al obtener audios:', error);
        return [];
      }
      
      // Filtrar los archivos que contengan la identificación en el nombre
      
      const filteredFiles = data.filter(file => file.name.includes(`-${patientId}-`));
      // Construir las URLs de descarga
      return await Promise.all(filteredFiles.map(async (file) => {
        const { data, error } = await this.supabase
          .storage
          .from('pronunt-storage')
          .createSignedUrl(`raw/app/${file.name}`, 60 * 60); // 1 hora de validez
      
        if (error) {
          console.error('Error obteniendo URL firmada:', error);
          return { name: file.name, url: '' }; // Retornar con URL vacía si hay error
        }
      
        return { name: file.name, url: data.signedUrl };
      }));

    } catch (error) {
      console.error('Error al obtener audios:', error);
      return [];
    }
  }
}
