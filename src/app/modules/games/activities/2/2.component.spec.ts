import { ComponentFixture, TestBed } from '@angular/core/testing';

import { 2Component } from './2.component';

describe('2Component', () => {
  let component: 2Component;
  let fixture: ComponentFixture<2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
