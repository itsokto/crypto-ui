import { Component, OnInit } from '@angular/core';
import { CryptoApiService } from './crypto/services/crypto.api.service';
import { combineLatest, Observable, of } from 'rxjs';
import { CryptoListing } from './crypto/models/crypto.listing';
import {
  concatMap,
  filter,
  map,
  retry,
  share,
  shareReplay,
  startWith,
  switchMap,
  take,
  throttleTime,
} from 'rxjs/operators';
import { CryptoCurrency, CryptoCurrencyMap } from './crypto/models/crypto.currency';
import { CryptoWebsocketCurrency, CryptoWebsocketData } from './crypto/models/websocket/crypto.websocket.data';
import { Store } from '@ngrx/store';
import { cryptoSelectors } from './store/selectors/crypto.selectors';
import { IAppState } from './store';
import { loadCryptos, updateCrypto } from './store/actions/crypto.actions';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyModalComponent, CurrencyModalData } from './components/modals/currency-modal/currency-modal.component';
import { appLoaded } from './common/animations';
import { CryptoCardData } from './components/crypto-card/models/crypto-card-data';

@Component({
  selector: 'cu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [appLoaded],
})
export class AppComponent implements OnInit {
  cryptoItems$: Observable<CryptoCardData[]> = of();
  selectedCurrency: CryptoCurrency = { id: 2781, name: '', symbol: 'USD', sign: '$' };
  currentCrypto$: Observable<string> = of();
  fiatMap$: Observable<CryptoCurrency[]> = of();
  currenciesMap$: Observable<CryptoCurrencyMap[]> = of();
  currenciesQuotesLatest$: Observable<Record<string, CryptoListing>> = of();
  isLoading$: Observable<boolean> = of();

  constructor(private _cryptoApi: CryptoApiService, private _store: Store<IAppState>, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this._cryptoApi.setApiKey('1507c111-13c0-45f2-82a3-4b9308314aa2');

    this.cryptoItems$ = this._store.select(cryptoSelectors.selectAll);

    this.isLoading$ = this._store.select(cryptoSelectors.selectLoading);

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

    const websocket$ = this._store.select(cryptoSelectors.selectIds).pipe(
      filter((ids) => ids.length > 0),
      take(1),
      switchMap((ids) => this._cryptoApi.connect(ids as number[]).pipe(retry(3))),
      map((message) => message as CryptoWebsocketData<CryptoWebsocketCurrency>),
      share()
    );

    this.currentCrypto$ = combineLatest([websocket$, this.currenciesMap$]).pipe(
      map(([message, currenciesMap]) => {
        return currenciesMap.find((map) => map.id === message.d.cr.id)?.symbol ?? '';
      }),
      startWith('...'),
      throttleTime(200)
    );

    combineLatest([websocket$, this.currenciesQuotesLatest$]).subscribe(([message, currenciesQuotesLatest]) => {
      if (!this.selectedCurrency || !currenciesQuotesLatest) {
        return;
      }

      this.updateCrypto(message, currenciesQuotesLatest);
    });

    this._store.dispatch(loadCryptos({ params: { convert: this.selectedCurrency } }));
  }

  openSelectCurrencyDialog(): void {
    const dialog$ = this.fiatMap$.pipe(
      map((fiatMap) => {
        const data: CurrencyModalData = {
          currencies: fiatMap,
          selectedCurrency: this.selectedCurrency,
        };

        return this._dialog.open(CurrencyModalComponent, { data, maxWidth: 880 });
      })
    );

    dialog$.pipe(concatMap((dialog) => dialog.afterClosed())).subscribe((currency: CryptoCurrency | undefined) => {
      if (!currency || currency.id === this.selectedCurrency.id) {
        return;
      }

      this.selectedCurrency = currency;
      this._store.dispatch(loadCryptos({ params: { convert: this.selectedCurrency } }));
    });
  }

  trackByFn(index: number, item: CryptoCardData) {
    return item.id;
  }

  private updateCrypto(
    data: CryptoWebsocketData<CryptoWebsocketCurrency>,
    currenciesQuotesLatest: Record<string, CryptoListing>
  ): void {
    // all updates come in USD, so we need to convert them to selected currency
    const price = currenciesQuotesLatest[this.selectedCurrency.id].quote['USD'].price;

    const newPrice = data.d.cr.p / price;

    this._store.dispatch(
      updateCrypto({
        id: data.d.cr.id,
        changes: {
          price: newPrice,
          percent_change_1h: data.d.cr.p1h,
          percent_change_24h: data.d.cr.p24h,
          percent_change_7d: data.d.cr.p7d,
        },
      })
    );
  }
}
