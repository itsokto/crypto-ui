import { Component, OnInit } from '@angular/core';
import { CryptoDataService, CryptoWebsocketService } from './crypto/services';
import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, take } from 'rxjs/operators';
import { CryptoWebsocketCurrency, CryptoWebsocketData } from './crypto/models/websocket/crypto.websocket.data';
import { Store } from '@ngrx/store';
import { IAppState } from './store';
import { cryptoSelectors } from './crypto/store/selectors/crypto.selectors';

@Component({
  selector: 'cu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentCrypto$: Observable<string> = of();

  constructor(
    private _cryptoData: CryptoDataService,
    private _cryptoWebsocket: CryptoWebsocketService,
    private _store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    const cryptoMessage$ = this._store.select(cryptoSelectors.selectIds).pipe(
      filter((cryptoIds) => cryptoIds.length > 0),
      take(1),
      switchMap((cryptoIds) => {
        const message = {
          method: 'subscribe',
          id: 'price',
          data: {
            cryptoIds,
          },
        };

        this._cryptoWebsocket.send(message);

        return this._cryptoWebsocket.websocket$;
      }),
      map((message) => message as CryptoWebsocketData<CryptoWebsocketCurrency>),
      debounceTime(200)
    );

    this.currentCrypto$ = combineLatest([cryptoMessage$, this._cryptoData.currenciesMap$]).pipe(
      map(([message, currenciesMap]) => {
        const currency = currenciesMap.find((currency) => currency.id === message.d.cr.id);
        return currency?.symbol ?? '';
      }),
      startWith('...')
    );
  }
}
