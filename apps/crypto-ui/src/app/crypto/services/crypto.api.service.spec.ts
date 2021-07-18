import { TestBed } from '@angular/core/testing';

import { CryptoApiService } from './crypto.api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Crypto.ApiService', () => {
  let service: CryptoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CryptoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
