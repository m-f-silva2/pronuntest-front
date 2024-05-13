import { ComponentFixture, TestBed } from '@angular/core/testing';

import { 1Component } from './1.component';

describe('1Component', () => {
  let component: 1Component;
  let fixture: ComponentFixture<1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
