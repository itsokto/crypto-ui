import { TestBed } from '@angular/core/testing';

import { CryptoWebsocketService } from './crypto-websocket.service';
import { CryptoApiService } from './crypto-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CryptoWebsocketService', () => {
  let service: CryptoWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers:[CryptoWebsocketService, CryptoApiService] });
    service = TestBed.inject(CryptoWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
