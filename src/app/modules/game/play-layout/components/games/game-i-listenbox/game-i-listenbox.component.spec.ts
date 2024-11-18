import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameIListenboxComponent } from './game-i-listenbox.component';

describe('GameIListenboxComponent', () => {
  let component: GameIListenboxComponent;
  let fixture: ComponentFixture<GameIListenboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameIListenboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameIListenboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
