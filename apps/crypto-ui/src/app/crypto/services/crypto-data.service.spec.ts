import { TestBed } from '@angular/core/testing';

import { CryptoDataService } from './crypto-data.service';
import { CryptoApiService } from './crypto-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CryptoDataService', () => {
  let service: CryptoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CryptoDataService, CryptoApiService],
    });
    service = TestBed.inject(CryptoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
