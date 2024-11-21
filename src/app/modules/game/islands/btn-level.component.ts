import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-level',
  standalone: true,
  imports: [],
  template: `
  <div class="h-full relative hover:scale-105 hover:transition-all" (click)="handleClick()">
  @if (data.state === 'unlock') {
    <div class="animate-bounce text-4xl text-[#e9e0cf] absolute -bottom-7 left-4 font-ShadyLane drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
      {{data.level}}
    </div>
  }@else{
    
    <svg class="absolute -bottom-9 left-4" width="21" height="21" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    
<g filter="url(#filter0_i_425_63)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.6228 1C22.6485 1.5689 25.2314 3.44138 24.9085 6.29313L24.8531 6.78271L26.3698 6.95439C26.3698 6.95439 30.2986 9.5635 29.7369 14.5254C29.7369 22.5001 20.1232 22.4008 12.1659 21.5001C3.99998 19.5001 0.354686 16.2656 0.920929 11.2635C1.48717 6.26132 5.89526 4.63668 5.89526 4.63668L7.41189 4.80836L7.46731 4.31878C7.79012 1.46703 12.5971 0.431096 17.6228 1ZM16.4373 3.10285C19.334 3.43075 20.8389 4.58131 20.6817 6.3105L12.1659 5.5C12.3992 3.77943 13.5406 2.77495 16.4373 3.10285ZM18.9907 11.0776C18.8799 12.0568 17.6341 12.3256 16.5218 12.5336L17.6228 16.3771L12.2639 15.7705L14.2469 12.2761C13.2092 11.8247 12.055 11.2842 12.1659 10.305C12.2883 9.22349 13.9431 8.27488 15.8277 8.48822C17.7123 8.70156 19.1132 9.99606 18.9907 11.0776Z" fill="#ADADAD"/>
</g>
<defs>
<filter id="filter0_i_425_63" x="0.863922" y="0.849854" width="28.9279" height="22.0625" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_425_63"/>
</filter>
</defs>
</svg>



  }
  <img src="assets/images/level_base.svg" alt="" srcset="">
  `
})
export class BtnLevelComponent {
  @Input() data: { state: 'block' | 'unlock', island?: number, level?: number } = { state: 'block' }
  @Output() _handleClick = new EventEmitter<{ state: 'block' | 'unlock', island?: number, level?: number }>()

  handleClick() {
    this._handleClick.emit(this.data);
  }
}
