import { Injectable } from '@angular/core';
import { CryptoApiService } from './crypto-api.service';
import { concatMap, map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CryptoCurrency, CryptoCurrencyMap } from '../models/crypto.currency';
import { CryptoListing } from '../models/crypto.listing';

@Injectable()
export class CryptoDataService {
  fiatMap$: Observable<CryptoCurrency[]>;
  currenciesQuotesLatest$: Observable<Record<string, CryptoListing>>;
  currenciesMap$: Observable<CryptoCurrencyMap[]>;

  constructor(private _cryptoApi: CryptoApiService) {
    this.fiatMap$ = this._cryptoApi.getFiatMap().pipe(
      map((response) => response.data),
      shareReplay()
    );

    this.currenciesQuotesLatest$ = this.fiatMap$.pipe(
      concatMap((fiatMap) => this._cryptoApi.getCurrencyQuotesLatest(fiatMap.map((fiat) => fiat.id))),
      map((response) => response.data),
      shareReplay()
    );

    this.currenciesMap$ = this._cryptoApi.getCurrencyMap().pipe(
      map((response) => response.data),
      shareReplay()
    );
  }
}
