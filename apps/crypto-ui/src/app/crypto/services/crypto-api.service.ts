import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoResponse } from '../models/crypto.response';
import { CryptoListing } from '../models/crypto.listing';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CryptoCurrency, CryptoCurrencyMap } from '../models/crypto.currency';
import { CRYPTO_MODULE_CONFIG, CryptoModuleConfig } from '../models/crypto-module.config';

@Injectable()
export class CryptoApiService {
  private _webSocket: WebSocketSubject<unknown> | undefined;
  private readonly _apiKey: string | undefined;

  constructor(
    private _httpClient: HttpClient,
    @Inject(CRYPTO_MODULE_CONFIG) @Optional() private _config?: CryptoModuleConfig
  ) {
    this._apiKey = _config?.apiKey;
  }

  getListingLatest(convert?: string): Observable<CryptoResponse<CryptoListing[]>> {
    const params: { convert?: string } = { convert };

    return this.getInternal<CryptoResponse<CryptoListing[]>>('api/cryptocurrency/listings/latest', { params });
  }

  getFiatMap(): Observable<CryptoResponse<CryptoCurrency[]>> {
    return this.getInternal<CryptoResponse<CryptoCurrency[]>>('api/fiat/map');
  }

  getCurrencyMap(): Observable<CryptoResponse<CryptoCurrencyMap[]>> {
    return this.getInternal<CryptoResponse<CryptoCurrencyMap[]>>('api/cryptocurrency/map');
  }

  getCurrencyQuotesLatest(ids: number[]): Observable<CryptoResponse<Record<string, CryptoListing>>> {
    return this.getInternal<CryptoResponse<Record<string, CryptoListing>>>('api/cryptocurrency/quotes/latest', {
      params: { id: ids.join() },
    });
  }

  private getInternal<T>(
    url: string,
    options: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      responseType?: 'json';
      params?:
        | HttpParams
        | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
    } = {}
  ): Observable<T> {
    options.headers ??= {};
    if (options.headers instanceof HttpHeaders) {
      options.headers.append('X-CMC_PRO_API_KEY', this._apiKey ?? '');
    } else {
      (options.headers as Record<string, string>)['X-CMC_PRO_API_KEY'] = this._apiKey ?? '';
    }

    return this._httpClient.get<T>(url, options);
  }

  connect(): WebSocketSubject<unknown> {
    if (this._webSocket) {
      return this._webSocket;
    }

    return webSocket('wss://stream.coinmarketcap.com/price/latest');
  }
}
