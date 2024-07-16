import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-text-to-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-to-audio.component.html',
  styleUrls: ['./text-to-audio.component.css']
})
export class TextToAudioComponent {
  @ViewChild('textInput') textInput: ElementRef | undefined;
  text: string = '';
  volume: number = 1;
  rate: number = 1;
  pitch: number = 1;
  selectedVoice: SpeechSynthesisVoice | null = null;
  voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadVoices();
  }

  loadVoices() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    } else {
      alert('Sorry, your browser does not support text to speech!');
    }
  }

  convertTextToAudio() {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(this.text);
      speech.volume = this.volume;
      speech.rate = this.rate;
      speech.pitch = this.pitch;
      if (this.selectedVoice) {
        speech.voice = this.selectedVoice;
      }
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text to speech!');
    }
  }

  onInput(event: Event) {
    this.text = (event.target as HTMLInputElement).value;
  }

  onVoiceChange(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    this.selectedVoice = this.voices[selectedIndex];
  }

  onVolumeChange(event: Event) {
    this.volume = +(event.target as HTMLInputElement).value;
  }

  onRateChange(event: Event) {
    this.rate = +(event.target as HTMLInputElement).value;
  }

  onPitchChange(event: Event) {
    this.pitch = +(event.target as HTMLInputElement).value;
  }
}
