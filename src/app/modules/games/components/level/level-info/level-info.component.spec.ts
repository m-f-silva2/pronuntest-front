import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelInfoComponent } from './level-info.component';

describe('LevelInfoComponent', () => {
  let component: LevelInfoComponent;
  let fixture: ComponentFixture<LevelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LevelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
