import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslandManagerComponent } from './island-manager.component';

describe('IslandManagerComponent', () => {
  let component: IslandManagerComponent;
  let fixture: ComponentFixture<IslandManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IslandManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IslandManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
