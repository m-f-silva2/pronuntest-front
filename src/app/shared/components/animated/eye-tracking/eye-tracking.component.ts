import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-eye-tracking',
  standalone: true,
  imports: [],
  templateUrl: './eye-tracking.component.html',
  styleUrl: './eye-tracking.component.css'
})
export class EyeTrackingComponent {
  mouseX = 0;
  mouseY = 0;
  eyePositionX = 0;
  eyePositionY = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updateEyePosition();
  }

  updateEyePosition() {
    const eyeContainer = document.getElementById('eye-container');
    var pupil = document.getElementById('pupil');
    const containerRect = eyeContainer!.getBoundingClientRect();
    const pupilRadius = pupil!.offsetWidth / 2;
    
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    
    const deltaX = this.mouseX - centerX;
    const deltaY = this.mouseY - centerY;
    
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min((containerRect.height / 2) - pupilRadius, Math.sqrt(deltaX * deltaX + deltaY * deltaY));

    /*const radius = containerRect.width / 2 - 15; // 15 is half the pupil size
    
    
    const pupilPositionX = centerX + Math.cos(angle) * radius;
    const pupilPositionY = centerY + Math.sin(angle) * radius;
    
    this.eyePositionX = pupilPositionX;
    this.eyePositionY = pupilPositionY;*/

    const pupilX = centerX + Math.cos(angle) * distance - pupilRadius;
    const pupilY = centerY + Math.sin(angle) * distance - pupilRadius;

    pupil!.style.left = `${pupilX - containerRect.left}px`;
    pupil!.style.top = `${pupilY - containerRect.top}px`;
  }
}
