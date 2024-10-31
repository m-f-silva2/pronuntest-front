import { Component } from '@angular/core';

@Component({
  selector: 'app-conffety',
  standalone: true,
  imports: [],
  template: `
  <div class="fixed top-0 left-0 w-screen h-screen select-none pointer-events-none z-50 flex justify-center items-center">
    <div class="sprint overflow-hidden w-[1050px] h-[626px] ">
    </div>
  </div>
  `,
  styles: `.sprint {
    background-image: url("/assets/images/confetti.svg"); 
    height: 626px; 
    background-size: cover; 
    background-repeat: no-repeat;
    animation: sprint .48s both;
  }
  @keyframes sprint {
    0% {   background-position:    0px    0px; }
    0.1% {   background-position:  0px    0px; }
    20% {  background-position:    0px    0px; }
    20.1% {  background-position: -1050px 0px; }
    40% {  background-position:   -1050px 0px; }
    40.1% {  background-position: -2100px 0px; }
    60% {  background-position:   -2100px 0px; }
    60.1% {  background-position: -3150px 0px; }
    80% {  background-position:   -3150px 0px; }
    80.1% {  background-position: -4200px 0px; }
    90% { background-position:   -4200px 0px; }
    90.1% { background-position: -5250px 0px; }
    92% { opacity: 1; }
    100% { opacity: 0; }
  }`
})
export class ConffetyComponent {}