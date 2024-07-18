import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Game0Component } from './game-0.component';

describe('Game0Component', () => {
  let component: Game0Component;
  let fixture: ComponentFixture<Game0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Game0Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Game0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
