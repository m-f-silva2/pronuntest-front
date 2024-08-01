import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-level',
  standalone: true,
  imports: [],
  template: `
  <div class="h-full relative" (click)="handleClick()">
  @if (data.state === 'unlock') {
    <div class="animate-bounce text-5xl text-sky-200 absolute bottom-7 left-4 font-knightwarrior drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
      {{data.level}}
    </div>
  }@else{
    <svg class="text-5xl absolute bottom-7 left-2" width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_290_28)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M20 0.5C26.6274 0.5 31.5 4.17509 31.5 10V11H33.5C33.5 11 39 15.365 39 25.5001C39 35.7173 30.4934 42 20 42C9.50659 42 1 35.7173 1 25.5001C1 15.2828 6.5 11 6.5 11H8.5V10C8.5 4.17509 13.3726 0.5 20 0.5ZM20 5.5C23.8199 5.5 25.9488 7.47681 25.9991 11H14.0009C14.0512 7.47681 16.1801 5.5 20 5.5ZM24.5 21C24.5 23 22.9176 23.8266 21.5 24.5L23.5 32H16.4331L18.5 24.5C17.0824 23.8266 15.5 23 15.5 21C15.5 18.7909 17.5147 16.5 20 16.5C22.4853 16.5 24.5 18.7909 24.5 21Z" fill="#D9D9D9"/>
      </g>
      <defs>
      <filter id="filter0_d_290_28" x="0" y="0.5" width="40" height="44.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="2"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_290_28"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_290_28" result="shape"/>
      </filter>
      </defs>
    </svg>
  }
  <svg class="w-full h-full" width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.95 11C29.95 13.4608 28.2873 15.6972 25.5809 17.3211C22.8754 18.9443 19.1346 19.95 15 19.95C10.8654 19.95 7.12458 18.9443 4.41912 17.3211C1.71267 15.6972 0.05 13.4608 0.05 11C0.05 8.53916 1.71267 6.30276 4.41912 4.67888C7.12458 3.05561 10.8654 2.04997 15 2.04997C19.1346 2.04997 22.8754 3.05561 25.5809 4.67888C28.2873 6.30276 29.95 8.53916 29.95 11Z" fill="#565656" stroke="#272727" stroke-width="0.1"/>
      <path d="M29.95 9.00001C29.95 11.4608 28.2873 13.6972 25.5809 15.3211C22.8754 16.9444 19.1346 17.95 15 17.95C10.8654 17.95 7.12458 16.9444 4.41912 15.3211C1.71267 13.6972 0.05 11.4608 0.05 9.00001C0.05 6.53919 1.71267 4.30279 4.41912 2.67892C7.12458 1.05564 10.8654 0.05 15 0.05C19.1346 0.05 22.8754 1.05564 25.5809 2.67892C28.2873 4.30279 29.95 6.53919 29.95 9.00001Z" fill="url(#paint0_linear_80_6364)" stroke="black" stroke-width="0.1"/>
      <defs>
        <linearGradient id="paint0_linear_80_6364" x1="15" y1="18" x2="23" y2="-1.94131e-06" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F4F4F4"/>
        <stop offset="1" stop-color="#BEBEBE"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
  `
})
export class BtnLevelComponent {
  @Input() data: { state: 'block' | 'unlock', island?: number, level?: number } = { state: 'block' }
  @Output() _handleClick = new EventEmitter<{ state: 'block' | 'unlock', island?: number, level?: number }>()

  handleClick() {
    this._handleClick.emit(this.data);
  }
}
