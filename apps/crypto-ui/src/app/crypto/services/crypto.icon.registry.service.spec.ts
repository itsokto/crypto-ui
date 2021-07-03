import { TestBed } from '@angular/core/testing';

import { CryptoIconRegistryService } from './crypto.icon.registry.service';

describe('Crypto.Icon.RegistryService', () => {
  let service: CryptoIconRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoIconRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
