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
    console.log('>>', "uploadAudiouploadAudiouploadAudio");
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
}
