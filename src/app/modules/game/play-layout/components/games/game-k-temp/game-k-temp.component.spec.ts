import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameKTempComponent } from './game-k-temp.component';

describe('GameKTempComponent', () => {
  let component: GameKTempComponent;
  let fixture: ComponentFixture<GameKTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameKTempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameKTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
