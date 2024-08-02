import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-text-to-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-to-audio.component.html',
  styleUrls: ['./text-to-audio.component.css']
})
export class TextToAudioComponent  implements OnInit {
  @ViewChild('textInput') textInput: ElementRef | undefined;
  text: string = '';
  volume: number = 1;
  rate: number = 1;
  pitch: number = 1;
  selectedVoice: SpeechSynthesisVoice | null = null;
  voices: SpeechSynthesisVoice[] = [];

  constructor(private renderer: Renderer2) {
    this.loadVoices();
    //this.loadGodotEngine();
  }

  ngOnInit(): void {
    // Insert meta tags
    const metaCharset = this.renderer.createElement('meta');
    metaCharset.setAttribute('charset', 'utf-8');
    document.head.appendChild(metaCharset);

    const metaViewport = this.renderer.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, user-scalable=no';
    document.head.appendChild(metaViewport);

    // Insert title
    const title = this.renderer.createElement('title');
    const titleText = this.renderer.createText('PronunTest');
    title.appendChild(titleText);
    document.head.appendChild(title);

    // Insert link tags
    const linkIcon = this.renderer.createElement('link');
    linkIcon.id = '-gd-engine-icon';
    linkIcon.rel = 'icon';
    linkIcon.type = 'image/png';
    linkIcon.href = 'assets/godot/index.icon.png';
    document.head.appendChild(linkIcon);

    const linkAppleIcon = this.renderer.createElement('link');
    linkAppleIcon.rel = 'apple-touch-icon';
    linkAppleIcon.href = 'assets/godot/index.apple-touch-icon.png';
    document.head.appendChild(linkAppleIcon);

    // Insert script tags
    /*
    const scriptEngine2 = this.renderer.createElement('script');
    scriptEngine2.src = 'assets/godot/coi-serviceworker.min.js';
    scriptEngine2.async = true;
    document.body.appendChild(scriptEngine2);*/
    const scriptEngine = this.renderer.createElement('script');
    scriptEngine.src = 'assets/godot/index.js';
    scriptEngine.async = true;
    document.body.appendChild(scriptEngine);
    

    scriptEngine.onload = () => {
      const GODOT_CONFIG = {
        "args": [],
        "canvasResizePolicy": 2,
        "executable": "assets/godot/index",
        "experimentalVK": false,
        "fileSizes": {
          "assets/godot/index.pck": 6017568,
          "assets/godot/index.wasm": 52315256
        },
        "focusCanvas": true,
        "gdextensionLibs": []
      };
      const engine = new (window as any).Engine(GODOT_CONFIG);

      (function () {
        const INDETERMINATE_STATUS_STEP_MS = 100;
        const statusProgress = document.getElementById('status-progress') as HTMLElement;
        const statusProgressInner = document.getElementById('status-progress-inner') as HTMLElement;
        const statusIndeterminate = document.getElementById('status-indeterminate') as HTMLElement;
        const statusNotice = document.getElementById('status-notice') as HTMLElement;

        let initializing = true;
        let statusMode: 'hidden' | 'progress' | 'indeterminate' | 'notice' = 'hidden';

        let animationCallbacks: Array<(time: number) => void> = [];
        function animate(time: number) {
          animationCallbacks.forEach((callback) => callback(time));
          requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        function animateStatusIndeterminate(ms: number) {
          const i = Math.floor((ms / INDETERMINATE_STATUS_STEP_MS) % 8);
          const children = statusIndeterminate.children as HTMLCollectionOf<HTMLElement>;
          if (children[i].style.borderTopColor === '') {
            Array.prototype.slice.call(children).forEach((child: HTMLElement) => {
              child.style.borderTopColor = '';
            });
            children[i].style.borderTopColor = '#dfdfdf';
          }
        }

        function setStatusMode(mode: 'hidden' | 'progress' | 'indeterminate' | 'notice') {
          if (statusMode === mode || !initializing) {
            return;
          }
          [statusProgress, statusIndeterminate, statusNotice].forEach((elem) => {
            elem.style.display = 'none';
          });
          animationCallbacks = animationCallbacks.filter(function (value) {
            return (value !== animateStatusIndeterminate);
          });
          switch (mode) {
            case 'progress':
              statusProgress.style.display = 'block';
              break;
            case 'indeterminate':
              statusIndeterminate.style.display = 'block';
              animationCallbacks.push(animateStatusIndeterminate);
              break;
            case 'notice':
              statusNotice.style.display = 'block';
              break;
            case 'hidden':
              break;
            default:
              throw new Error('Invalid status mode');
          }
          statusMode = mode;
        }

        function setStatusNotice(text: string) {
          while (statusNotice.lastChild) {
            statusNotice.removeChild(statusNotice.lastChild);
          }
          const lines = text.split('\n');
          lines.forEach((line) => {
            statusNotice.appendChild(document.createTextNode(line));
            statusNotice.appendChild(document.createElement('br'));
          });
        }

        function displayFailureNotice(err: any) {
          const msg = err.message || err;
          console.error(msg);
          setStatusNotice(msg);
          setStatusMode('notice');
          initializing = false;
        }

        const missing = (window as any).Engine.getMissingFeatures();
        if (missing.length !== 0) {
          const missingMsg = 'Error\nThe following features required to run Godot projects on the Web are missing:\n';
          displayFailureNotice(missingMsg + missing.join('\n'));
        } else {
          setStatusMode('indeterminate');
          engine.startGame({
            'onProgress': function (current: number, total: number) {
              if (total > 0) {
                statusProgressInner.style.width = `${(current / total) * 100}%`;
                setStatusMode('progress');
                if (current === total) {
                  // wait for progress bar animation
                  setTimeout(() => {
                    setStatusMode('indeterminate');
                  }, 500);
                }
              } else {
                setStatusMode('indeterminate');
              }
            },
          }).then(() => {
            setStatusMode('hidden');
            initializing = false;
          }, displayFailureNotice);
        }
      }());
    };
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
