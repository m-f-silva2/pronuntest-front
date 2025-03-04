import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiosManagerComponent } from './audios-manager.component';

describe('AudiosManagerComponent', () => {
  let component: AudiosManagerComponent;
  let fixture: ComponentFixture<AudiosManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudiosManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
