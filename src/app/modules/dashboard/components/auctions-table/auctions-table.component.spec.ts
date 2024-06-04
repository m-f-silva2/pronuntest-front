import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsTableComponent } from './auctions-table.component';

describe('AuctionsTableComponent', () => {
  let component: AuctionsTableComponent;
  let fixture: ComponentFixture<AuctionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuctionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
