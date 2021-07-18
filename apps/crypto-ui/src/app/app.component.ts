import { Component, OnInit } from '@angular/core';
import { CryptoApiService } from './crypto/services/crypto.api.service';
import { BehaviorSubject } from 'rxjs';
import { CryptoListing, CryptoQuote } from './crypto/models/crypto.listing';
import { filter, retry, switchMap, take, throttleTime } from 'rxjs/operators';
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

@Component({
  selector: 'cu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [appLoaded],
})
export class AppComponent implements OnInit {
  title = '';
  listing: CryptoListing[] = [];
  selectedCurrency: CryptoCurrency = { id: 2781, name: '', symbol: 'USD', sign: '$' };
  currentCryptoSubject = new BehaviorSubject<string>('...');
  currentCrypto$ = this.currentCryptoSubject.pipe(throttleTime(200));
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

    this._store.select(cryptoSelectors.selectAll).subscribe((listing) => {
      this.listing = listing;

      if (listing.length > 0) {
        this.isLoading = false;
      }
    });

    this._cryptoApi.getFiatMap().subscribe((data) => {
      this.fiatMap = data.data ?? [];

      this._cryptoApi.getCurrencyQuotesLatest(this.fiatMap.map((fiat) => fiat.id)).subscribe((data) => {
        this.currenciesQuotesLatest = data.data ?? {};
      });
    });

    this._cryptoApi.getCurrencyMap().subscribe((data) => {
      this.currenciesMap = data.data ?? [];
    });

    this._store
      .select(cryptoSelectors.selectIds)
      .pipe(
        filter((ids) => ids.length > 0),
        take(1),
        switchMap((ids) => this._cryptoApi.connect(ids as number[]).pipe(retry(3)))
      )
      .subscribe((message) => {
        const data = message as CryptoWebsocketData<CryptoWebsocketCurrency>;

        const crypto = this.currenciesMap.find((map) => map.id === data.d.cr.id)?.symbol ?? '';
        this.currentCryptoSubject.next(crypto);

        if (!this.selectedCurrency || !this.currenciesQuotesLatest) {
          return;
        }

        this.updateCrypto(data);
      });

    this._store.dispatch(loadCryptos({ params: { convert: this.selectedCurrency.symbol } }));
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
      this._store.dispatch(loadCryptos({ params: { convert: this.selectedCurrency.symbol } }));
    });
  }

  trackByFn(index: number, item: CryptoListing) {
    return item.id;
  }

  private updateCrypto(data: CryptoWebsocketData<CryptoWebsocketCurrency>): void {
    const quote: Record<string, CryptoQuote> = {};

    // all updates come in USD, so we need to convert them to selected currency
    const price = this.currenciesQuotesLatest[this.selectedCurrency.id].quote['USD'].price;
    const percent_change_30d = this.listing.find((list) => list.id === data.d.cr.id)?.quote[
      this.selectedCurrency.symbol
    ]?.percent_change_30d;

    const newPrice = data.d.cr.p / price;

    // TODO: normalize store
    quote[this.selectedCurrency.symbol] = {
      last_updated: new Date(data.d.t),
      market_cap: 0,
      percent_change_60d: 0,
      percent_change_90d: 0,
      volume_24h: 0,
      percent_change_1h: data.d.cr.p1h,
      percent_change_24h: data.d.cr.p24h,
      percent_change_7d: data.d.cr.p7d,
      percent_change_30d: data.d.cr.p30d ?? percent_change_30d ?? 0,
      price: newPrice,
    };

    this._store.dispatch(
      updateCrypto({
        id: data.d.cr.id,
        changes: { quote },
      })
    );
  }
}
