import { Injectable } from '@angular/core';
import { CryptoWebsocketData } from '../models/websocket/crypto.websocket.data';
import { Observable } from 'rxjs';
import { CryptoApiService } from './crypto-api.service';
import { map, share } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable()
export class CryptoWebsocketService {
  websocket$: Observable<CryptoWebsocketData<unknown>>;
  private websocketSubject: WebSocketSubject<unknown>;

  constructor(private _cryptoApi: CryptoApiService) {
    this.websocketSubject = _cryptoApi.connect();
    this.websocket$ = this.websocketSubject.pipe(
      map((message) => message as CryptoWebsocketData<unknown>),
      share()
    );
  }

  send(message: unknown): void {
    this.websocketSubject.next(message);
  }
}
