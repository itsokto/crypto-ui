import { Component, OnInit } from '@angular/core';
import { CryptoApiService } from './crypto/services/crypto.api.service';
import { of } from 'rxjs';
import { CryptoListing } from './crypto/models/crypto.listing';
import { filter, map, retry, share, startWith, switchMap, take, throttleTime } from 'rxjs/operators';
import { CryptoCurrency, CryptoCurrencyMap } from './crypto/models/crypto.currency';
import { CryptoWebsocketCurrency, CryptoWebsocketData } from './crypto/models/websocket/crypto.websocket.data';
import { Store } from '@ngrx/store';
import { cryptoSelectors } from './store/selectors/crypto.selectors';
import { IAppState } from './store';
import { loadCryptos, updateCrypto } from './store/actions/crypto.actions';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyModalComponent, CurrencyModalData } from './components/modals/currency-modal/currency-modal.component';
import { CryptoIconRegistryService } from './crypto/services/crypto.icon.registry.service';
import { appLoaded } from './common/animations';
import { CryptoCardData } from './components/crypto-card/models/crypto-card-data';

@Component({
  selector: 'cu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [appLoaded],
})
export class AppComponent implements OnInit {
  title = '';
  cryptoItems: CryptoCardData[] = [];
  selectedCurrency: CryptoCurrency = { id: 2781, name: '', symbol: 'USD', sign: '$' };
  currentCrypto$ = of('');
  fiatMap: CryptoCurrency[] = [];
  currenciesMap: CryptoCurrencyMap[] = [];
  currenciesQuotesLatest: Record<string, CryptoListing> = {};
  isLoading = true;

  constructor(
    private _cryptoApi: CryptoApiService,
    private _store: Store<IAppState>,
    public dialog: MatDialog,
    public readonly cryptoIconRegistry: CryptoIconRegistryService
  ) {}

  ngOnInit(): void {
    this.cryptoIconRegistry.registerIcons();

    this._cryptoApi.setApiKey('1507c111-13c0-45f2-82a3-4b9308314aa2');

    this._store.select(cryptoSelectors.selectAll).subscribe((cryptoItems) => {
      this.cryptoItems = cryptoItems;

      if (cryptoItems.length > 0) {
        this.isLoading = false;
      }
    });

    this._cryptoApi.getFiatMap().subscribe((response) => {
      this.fiatMap = response.data ?? [];

      this._cryptoApi.getCurrencyQuotesLatest(this.fiatMap.map((fiat) => fiat.id)).subscribe((response) => {
        this.currenciesQuotesLatest = response.data ?? {};
      });
    });

    this._cryptoApi.getCurrencyMap().subscribe((response) => {
      this.currenciesMap = response.data ?? [];
    });

    const websocket$ = this._store.select(cryptoSelectors.selectIds).pipe(
      filter((ids) => ids.length > 0),
      take(1),
      switchMap((ids) => this._cryptoApi.connect(ids as number[]).pipe(retry(3))),
      map((message) => message as CryptoWebsocketData<CryptoWebsocketCurrency>),
      share()
    );

    this.currentCrypto$ = websocket$.pipe(
      map((message) => {
        return this.currenciesMap.find((map) => map.id === message.d.cr.id)?.symbol ?? '';
      }),
      startWith('...'),
      throttleTime(200)
    );

    websocket$.subscribe((message) => {
      if (!this.selectedCurrency || !this.currenciesQuotesLatest) {
        return;
      }

      this.updateCrypto(message);
    });

    this._store.dispatch(loadCryptos({ params: { convert: this.selectedCurrency } }));
  }

  openSelectCurrencyDialog() {
    const data: CurrencyModalData = {
      currencies: this.fiatMap,
      selectedCurrency: this.selectedCurrency,
    };

    const dialog = this.dialog.open(CurrencyModalComponent, { data, maxWidth: 880 });

    dialog.afterClosed().subscribe((currency: CryptoCurrency | undefined) => {
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

  private updateCrypto(data: CryptoWebsocketData<CryptoWebsocketCurrency>): void {
    // all updates come in USD, so we need to convert them to selected currency
    const price = this.currenciesQuotesLatest[this.selectedCurrency.id].quote['USD'].price;

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
