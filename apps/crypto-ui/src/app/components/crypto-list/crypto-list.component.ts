import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import { MatDialog } from '@angular/material/dialog';
import { bufferTime, concatMap, map } from 'rxjs/operators';
import { CryptoWebsocketCurrency, CryptoWebsocketData } from '../../crypto/models/websocket/crypto.websocket.data';
import { combineLatest, Observable, of } from 'rxjs';
import { CurrencyModalComponent, CurrencyModalData } from '../modals/currency-modal/currency-modal.component';
import { CryptoCurrency } from '../../crypto/models/crypto.currency';
import { CryptoCardData } from '../crypto-card/models/crypto-card-data';
import { CryptoListing } from '../../crypto/models/crypto.listing';
import { CryptoDataService, CryptoWebsocketService } from '../../crypto/services';
import { cryptoSelectors } from '../../crypto/store/selectors/crypto.selectors';
import { loadCryptos, updateCryptos } from '../../crypto/store/actions/crypto.actions';

@Component({
  selector: 'cu-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements OnInit {
  cryptoItems$: Observable<CryptoCardData[]> = of();
  selectedCurrency: CryptoCurrency = { id: 2781, name: '', symbol: 'USD', sign: '$' };
  isLoading$: Observable<boolean> = of();

  constructor(
    private _cryptoData: CryptoDataService,
    private _cryptoWebsocket: CryptoWebsocketService,
    private _store: Store<IAppState>,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cryptoItems$ = this._store.select(cryptoSelectors.selectAll);

    this.isLoading$ = this._store.select(cryptoSelectors.selectLoading);

    const websocket$ = this._cryptoWebsocket.websocket$.pipe(
      map((message) => message as CryptoWebsocketData<CryptoWebsocketCurrency>),
      bufferTime(500)
    );

    combineLatest([websocket$, this._cryptoData.currenciesQuotesLatest$]).subscribe(
      ([message, currenciesQuotesLatest]) => {
        if (!this.selectedCurrency || !currenciesQuotesLatest) {
          return;
        }

        this.updateCryptos(message, currenciesQuotesLatest);
      }
    );

    this._store.dispatch(loadCryptos({ params: { convert: this.selectedCurrency } }));
  }

  openSelectCurrencyDialog(): void {
    const dialog$ = this._cryptoData.fiatMap$.pipe(
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

  private updateCryptos(
    data: CryptoWebsocketData<CryptoWebsocketCurrency>[],
    currenciesQuotesLatest: Record<string, CryptoListing>
  ): void {
    // all updates come in USD, so we need to convert them to selected currency
    const price = currenciesQuotesLatest[this.selectedCurrency.id].quote['USD'].price;

    const updates = data.map((cryptoData) => {
      const newPrice = cryptoData.d.cr.p / price;
      const { id, p1h, p24h, p7d } = cryptoData.d.cr;

      return {
        id: id,
        changes: {
          price: newPrice,
          percent_change_1h: p1h,
          percent_change_24h: p24h,
          percent_change_7d: p7d,
        },
      };
    });

    this._store.dispatch(updateCryptos({ updates: updates }));
  }
}
