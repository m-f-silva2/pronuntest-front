import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsTableItemComponent } from './auctions-table-item.component';

describe('AuctionsTableItemComponent', () => {
  let component: AuctionsTableItemComponent;
  let fixture: ComponentFixture<AuctionsTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionsTableItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuctionsTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
