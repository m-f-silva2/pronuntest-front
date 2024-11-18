import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLTempComponent } from './game-l-temp.component';

describe('GameLTempComponent', () => {
  let component: GameLTempComponent;
  let fixture: ComponentFixture<GameLTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLTempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameLTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
