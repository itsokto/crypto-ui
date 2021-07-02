import { TestBed } from '@angular/core/testing';

import { CryptoApiService } from './crypto.api.service';

describe('Crypto.ApiService', () => {
  let service: CryptoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
