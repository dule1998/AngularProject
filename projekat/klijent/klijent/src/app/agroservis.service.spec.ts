import { TestBed } from '@angular/core/testing';

import { AgroservisService } from './agroservis.service';

describe('AgroservisService', () => {
  let service: AgroservisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgroservisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
