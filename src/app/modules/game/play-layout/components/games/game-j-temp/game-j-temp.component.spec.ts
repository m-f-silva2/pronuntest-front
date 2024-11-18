import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameJTempComponent } from './game-j-temp.component';

describe('GameJTempComponent', () => {
  let component: GameJTempComponent;
  let fixture: ComponentFixture<GameJTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameJTempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameJTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
