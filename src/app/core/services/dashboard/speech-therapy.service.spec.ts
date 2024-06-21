import { TestBed } from '@angular/core/testing';

import { SpeechTherapyService } from './speech-therapy.service';

describe('SpeechTherapyService', () => {
  let service: SpeechTherapyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechTherapyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
