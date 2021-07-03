import { Component, OnInit } from '@angular/core';
import { CryptoApiService } from './crypto/services/crypto.api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CryptoListing } from './crypto/models/crypto.listing';
import { filter, retry, switchMap, take, throttleTime } from 'rxjs/operators';
import { CryptoCurrency, CryptoCurrencyMap } from './crypto/models/crypto.currency';
import { trigger, style, animate, transition, animation, useAnimation, state } from '@angular/animations';
import { CryptoWebsocketCurrency, CryptoWebsocketData } from './crypto/models/websocket/crypto.websocket.data';
import { Store } from '@ngrx/store';
import { cryptoSelectors } from './store/selectors/crypto.selectors';
import { IAppState } from './store';
import { loadCryptos, updateCrypto } from './store/actions/crypto.actions';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyModalComponent, CurrencyModalData } from './components/modals/currency-modal/currency-modal.component';
import { CryptoIconRegistryService } from './crypto/services/crypto.icon.registry.service';

const blinkAnimation = animation([animate('0.1s', style({ color: 'white' })), animate('1s', style({}))]);
const shrinkAnimation = animation([animate('1s cubic-bezier(0.16, 1, 0.3, 1)')]);

@Component({
  selector: 'crypto-ui-workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('priceUpdate', [transition(':increment, :decrement', useAnimation(blinkAnimation))]),
    trigger('shrink', [
      state('false', style({})),
      state('true', style({ height: '20rem' })),
      transition('false => true', useAnimation(shrinkAnimation)),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = '';
  listing = new Observable<CryptoListing[]>();
  currencies = new Observable<CryptoCurrency[]>();
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

    this.listing = this._store.select(cryptoSelectors.selectAll);

    this.listing.pipe(filter((data) => data.length > 0)).subscribe(() => {
      this.isLoading = false;
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
    const quote: Record<string, any> = {};
    const price = data.d.cr.p / this.currenciesQuotesLatest[this.selectedCurrency.id].quote['USD'].price;

    quote[this.selectedCurrency.symbol] = {
      percent_change_1h: data.d.cr.p1h,
      percent_change_7d: data.d.cr.p7d,
      price: price,
    };

    this._store.dispatch(
      updateCrypto({
        id: data.d.cr.id,
        changes: { quote },
      })
    );
  }
}
